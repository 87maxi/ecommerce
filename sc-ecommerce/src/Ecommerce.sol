/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {CompanyLib} from "./libraries/CompanyLib.sol";
import {ProductLib} from "./libraries/ProductLib.sol";
import {CustomerLib} from "./libraries/CustomerLib.sol";
import {ShoppingCartLib} from "./libraries/ShoppingCartLib.sol";

contract Ecommerce {
    address public owner;
    address public euroTokenAddress;

    // Storage declarations
    CompanyLib.CompanyStorage internal companyStorage;
    ProductLib.ProductStorage internal productStorage;
    CustomerLib.CustomerStorage internal customerStorage;
    ShoppingCartLib.ShoppingCartStorage internal shoppingCartStorage;

    // Invoice structures
    struct InvoiceItem {
        uint256 productId;
        string productName;
        uint256 quantity;
        uint256 unitPrice;
        uint256 totalPrice;
    }

    struct Invoice {
        uint256 invoiceId;
        uint256 companyId;
        address customerAddress;
        InvoiceItem[] items;
        uint256 totalAmount;
        uint256 timestamp;
        bool isPaid;
        string paymentTxHash;
    }

    mapping(uint256 => Invoice) public invoices;
    mapping(address => uint256[]) private customerInvoices;
    mapping(uint256 => uint256[]) private companyInvoices;
    uint256 public nextInvoiceId;

    // Events
    event InvoiceCreated(uint256 indexed invoiceId, address indexed customer, uint256 companyId, uint256 totalAmount);
    event PaymentProcessed(uint256 indexed invoiceId, address indexed customer, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    modifier onlyCompanyOwner(uint256 companyId) {
        require(companyStorage.companies[companyId].owner == msg.sender, "Not company owner");
        _;
    }

    // Using declarations for libraries
    using CompanyLib for CompanyLib.CompanyStorage;
    using ProductLib for ProductLib.ProductStorage;
    using CustomerLib for CustomerLib.CustomerStorage;
    using ShoppingCartLib for ShoppingCartLib.ShoppingCartStorage;

    constructor(address _euroTokenAddress) {
        owner = msg.sender;
        euroTokenAddress = _euroTokenAddress;
        nextInvoiceId = 1;
    }

    // Company functions
    function registerCompany(string memory name, string memory description)
        external
        returns (uint256)
    {
        return companyStorage.registerCompany(msg.sender, name, description);
    }

    function deactivateCompany(uint256 companyId) external onlyCompanyOwner(companyId) {
        companyStorage.deactivateCompany(companyId);
    }

    function activateCompany(uint256 companyId) external onlyCompanyOwner(companyId) {
        companyStorage.activateCompany(companyId);
    }

    function getCompany(uint256 companyId)
        external
        view
        returns (CompanyLib.Company memory)
    {
        return companyStorage.getCompany(companyId);
    }

    function getCompanyByOwner(address owner) 
        external 
        view 
        returns (CompanyLib.Company memory)
    {
        return companyStorage.getCompanyByOwner(owner);
    }

    function isCompanyActive(uint256 companyId) external view returns (bool) {
        return companyStorage.isCompanyActive(companyId);
    }

    // Product functions
    function addProduct(
        uint256 companyId,
        string memory name,
        string memory description,
        uint256 price,
        string memory imageHash,
        uint256 stock
    ) external onlyCompanyOwner(companyId) returns (uint256) {
        return productStorage.addProduct(companyStorage, companyId, name, description, price, imageHash, stock);
    }

    function updateProduct(
        uint256 productId,
        string memory name,
        string memory description,
        uint256 price,
        string memory imageHash
    ) external returns (bool) {
        uint256 companyId = productStorage.products[productId].companyId;
        require(companyId != 0, "Product does not exist");
        require(companyStorage.companies[companyId].owner == msg.sender, "Not product owner");
        productStorage.updateProduct(productId, name, description, price, imageHash);
        return true;
    }

    function updateStock(uint256 productId, uint256 stock) external returns (bool) {
        uint256 companyId = productStorage.products[productId].companyId;
        require(companyId != 0, "Product does not exist");
        require(companyStorage.companies[companyId].owner == msg.sender, "Not product owner");
        productStorage.updateStock(productId, stock);
        return true;
    }

    function decreaseStock(uint256 productId, uint256 quantity) external returns (bool) {
        uint256 companyId = productStorage.products[productId].companyId;
        require(companyId != 0, "Product does not exist");
        require(companyStorage.companies[companyId].owner == msg.sender, "Not product owner");
        productStorage.decreaseStock(productId, quantity);
        return true;
    }

    function deactivateProduct(uint256 productId) external returns (bool) {
        uint256 companyId = productStorage.products[productId].companyId;
        require(companyId != 0, "Product does not exist");
        require(companyStorage.companies[companyId].owner == msg.sender, "Not product owner");
        productStorage.deactivateProduct(productId);
        return true;
    }

    function activateProduct(uint256 productId) external returns (bool) {
        uint256 companyId = productStorage.products[productId].companyId;
        require(companyId != 0, "Product does not exist");
        require(companyStorage.companies[companyId].owner == msg.sender, "Not product owner");
        productStorage.activateProduct(productId);
        return true;
    }

    function getProduct(uint256 productId)
        external
        view
        returns (ProductLib.Product memory)
    {
        return productStorage.getProduct(productId);
    }

    function getProductsByCompany(uint256 companyId)
        external
        view
        returns (ProductLib.Product[] memory)
    {
        return productStorage.getProductsByCompany(companyId);
    }

    function getAllProducts()
        external
        view
        returns (ProductLib.Product[] memory)
    {
        return productStorage.getAllProducts();
    }

    function isProductAvailable(uint256 productId, uint256 quantity)
        external
        view
        returns (bool)
    {
        return productStorage.isProductAvailable(productId, quantity);
    }

    // Customer functions
    function registerCustomer() external returns (bool) {
        return customerStorage.registerCustomer(msg.sender);
    }

    function getCustomer(address customerAddress)
        external
        view
        returns (CustomerLib.Customer memory)
    {
        return customerStorage.getCustomer(customerAddress);
    }

    function getAllCustomers()
        external
        view
        returns (CustomerLib.Customer[] memory)
    {
        return customerStorage.getAllCustomers();
    }

    function isCustomerRegistered(address customerAddress) external view returns (bool) {
        return customerStorage.isCustomerRegistered(customerAddress);
    }

    // Shopping cart functions
    function addToCart(uint256 productId, uint256 quantity) external returns (bool) {
        return shoppingCartStorage.addToCart(productStorage, msg.sender, productId, quantity);
    }

    function removeFromCart(uint256 productId) external returns (bool) {
        return shoppingCartStorage.removeFromCart(msg.sender, productId);
    }

    function updateQuantity(uint256 productId, uint256 quantity) external returns (bool) {
        return shoppingCartStorage.updateQuantity(productStorage, msg.sender, productId, quantity);
    }

    function getCart() external view returns (ShoppingCartLib.CartItem[] memory) {
        return shoppingCartStorage.getCart(msg.sender);
    }

    function clearCart() external {
        shoppingCartStorage.clearCart(msg.sender);
    }

    function calculateTotal() external view returns (uint256) {
        return shoppingCartStorage.calculateTotal(productStorage, msg.sender);
    }

    function getCartItemCount() external view returns (uint256) {
        return shoppingCartStorage.getCartItemCount(msg.sender);
    }

    // Invoice functions
    function createInvoice(address customer, uint256 companyId) external onlyCompanyOwner(companyId) returns (uint256) {
        require(customerStorage.isCustomer