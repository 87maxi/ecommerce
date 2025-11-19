// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Ecommerce} from "../src/Ecommerce.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract ERC20Test is Test {
    Ecommerce public ecommerce;
    MockERC20 public euroToken;
    
    address public owner = address(0x1);
    address public companyOwner = address(0x2);
    address public customer = address(0x3);
    
    uint256 public COMPANY_ID;
    uint256 public PRODUCT_ID;
    uint256 public INVOICE_ID;

    function setUp() public {
        // Fork from mainnet at a specific block to get real contract
        vm.createSelectFork("https://mainnet.infura.io/v3/11aa0002345678912345678912345678", 17000000);
        
        // Deploy mock Euro Token
        euroToken = new MockERC20("Euro Token", "EURT", 18);
        
        // Deploy Ecommerce contract
        vm.prank(owner);
        ecommerce = new Ecommerce(address(euroToken));
        
        // Mint some tokens to customer
        vm.prank(address(0)); // Impersonate minting role
        euroToken.mint(customer, 10000 * 10**18);
        
        // Prepare data for tests
        vm.startPrank(companyOwner);
        COMPANY_ID = ecommerce.registerCompany("Test Company", "A test company");
        PRODUCT_ID = ecommerce.addProduct(
            COMPANY_ID,
            "Test Product", 
            "A test product",
            100 * 10**18, 
            "ipfs://image", 
            10
        );
        vm.stopPrank();
        
        vm.startPrank(customer);
        ecommerce.registerCustomer();
        ecommerce.addToCart(PRODUCT_ID, 2);
        INVOICE_ID = ecommerce.createInvoice(customer, COMPANY_ID);
        vm.stopPrank();
    }

    // Functionality Tests
    function test_RegisterCompany() public {
        vm.startPrank(address(0x4));
        uint256 newCompanyId = ecommerce.registerCompany("New Company", "Another test company");
        assertEq(newCompanyId, 2);
        
        Ecommerce.Company memory company = ecommerce.getCompany(newCompanyId);
        assertEq(company.name, "New Company");
        assertEq(company.owner, address(0x4));
        assertEq(company.isActive, true);
        vm.stopPrank();
    }

    function test_AddProduct() public {
        vm.startPrank(companyOwner);
        uint256 newProductId = ecommerce.addProduct(
            COMPANY_ID,
            "New Product",
            "Another test product",
            200 * 10**18,
            "ipfs://newimage",
            5
        );
        assertEq(newProductId, 2);
        
        Ecommerce.Product memory product = ecommerce.getProduct(newProductId);
        assertEq(product.name, "New Product");
        assertEq(product.price, 200 * 10**18);
        assertEq(product.stock, 5);
        vm.stopPrank();
    }

    function test_ShoppingCart() public {
        vm.startPrank(customer);
        
        // Add to cart
        bool success = ecommerce.addToCart(PRODUCT_ID, 1);
        assertTrue(success);
        
        // Check cart contents
        Ecommerce.CartItem[] memory items = ecommerce.getCart();
        assertEq(items.length, 2); // Previous test added 2, now added 1 more
        assertEq(items[0].productId, PRODUCT_ID);
        assertEq(items[0].quantity, 2); // Original quantity
        
        // Update quantity
        success = ecommerce.updateQuantity(PRODUCT_ID, 5);
        assertTrue(success);
        items = ecommerce.getCart();
        assertEq(items[0].quantity, 5);
        
        // Calculate total
        uint256 total = ecommerce.calculateTotal();
        assertEq(total, 500 * 10**18); // 5 * 100 * 10**18
        
        // Clear cart
        ecommerce.clearCart();
        items = ecommerce.getCart();
        assertEq(items.length, 0);
        
        vm.stopPrank();
    }

    function test_CreateInvoice() public {
        Ecommerce.Invoice memory invoice = ecommerce.getInvoice(INVOICE_ID);
        assertEq(invoice.invoiceId, INVOICE_ID);
        assertEq(invoice.customerAddress, customer);
        assertEq(invoice.companyId, COMPANY_ID);
        assertEq(invoice.totalAmount, 200 * 10**18); // 2 * 100 * 10**18
        assertEq(invoice.isPaid, false);
        
        // Check invoice items
        Ecommerce.InvoiceItem[] memory items = ecommerce.getInvoiceItems(INVOICE_ID);
        assertEq(items.length, 1);
        assertEq(items[0].productName, "Test Product");
        assertEq(items[0].quantity, 2);
        assertEq(items[0].unitPrice, 100 * 10**18);
    }

    function test_ProcessPayment() public {
        vm.startPrank(customer);
        
        // Get initial balances
        uint256 customerBalanceBefore = euroToken.balanceOf(customer);
        uint256 companyBalanceBefore = euroToken.balanceOf(companyOwner);
        
        // Process payment
        bool success = ecommerce.processPayment(customer, 200 * 10**18, INVOICE_ID);
        assertTrue(success);
        
        // Check invoice status
        Ecommerce.Invoice memory invoice = ecommerce.getInvoice(INVOICE_ID);
        assertTrue(invoice.isPaid);
        
        // Check balances
        uint256 customerBalanceAfter = euroToken.balanceOf(customer);
        uint256 companyBalanceAfter = euroToken.balanceOf(companyOwner);
        
        assertEq(customerBalanceBefore - customerBalanceAfter, 200 * 10**18);
        assertEq(companyBalanceAfter - companyBalanceBefore, 200 * 10**18);
        
        // Check customer stats
        Ecommerce.Customer memory customerData = ecommerce.getCustomer(customer);
        assertEq(customerData.totalPurchases, 1);
        assertEq(customerData.totalSpent, 200 * 10**18);
        
        vm.stopPrank();
    }

    // Security Tests
    function test_ReentrancyGuard() public {
        // Test that payments cannot be reentrantly called
        vm.startPrank(customer);
        
        // First payment
        bool success = ecommerce.processPayment(customer, 200 * 10**18, INVOICE_ID);
        assertTrue(success);
        
        // Try to process same payment again
        vm.expectRevert();
        ecommerce.processPayment(customer, 200 * 10**18, INVOICE_ID);
        
        vm.stopPrank();
    }

    function test_AccessControl_CompanyOwner() public {
        // Try to add product as non-owner
        vm.expectRevert();
        vm.prank(address(0x5));
        ecommerce.addProduct(
            COMPANY_ID,
            "Hacked Product",
            "Should not work",
            100 * 10**18,
            "ipfs://hacked",
            1
        );
        
        // Try to deactivate company as non-owner
        vm.expectRevert();
        vm.prank(address(0x5));
        ecommerce.deactivateCompany(COMPANY_ID);
    }

    function test_InsufficientBalance() public {
        vm.startPrank(address(0x6));
        ecommerce.registerCustomer();
        ecommerce.addToCart(PRODUCT_ID, 2);
        uint256 invoiceId = ecommerce.createInvoice(address(0x6), COMPANY_ID);
        
        // Try to pay without enough balance
        vm.expectRevert();
        ecommerce.processPayment(address(0x6), 1000 * 10**18, invoiceId);
        
        vm.stopPrank();
    }

    function test_InsufficientStock() public {
        vm.startPrank(customer);
        
        // Try to add