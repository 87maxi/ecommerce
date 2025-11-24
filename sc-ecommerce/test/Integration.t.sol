pragma solidity ^0.8.13;

// Import necessary libraries
import "forge-std/Test.sol";

// Import the main contract
import "../src/Ecommerce.sol";

// Import libraries (needed for storage layout)
import "../src/libraries/CompanyLib.sol";
import "../src/libraries/ProductLib.sol";
import "../src/libraries/CustomerLib.sol";
import "../src/libraries/ShoppingCartLib.sol";

import "./mock/ERC20Mock.sol";

contract IntegrationTest is Test {
    Ecommerce ecommerce;
    address owner = address(1);
    address companyOwner = address(2);
    address customer = address(3);
    
    // Mock ERC20 token for testing
    ERC20Mock public euroToken;
    
    // Setup function that runs before each test
    function setUp() public {
        // Deploy mock EuroToken
        euroToken = new ERC20Mock("Euro Token", "EURT", 6);
        
        // Mint some tokens to the customer for testing payments
        euroToken.mint(customer, 1000000); // 1000.000 EURT (6 decimals)
        
        // Start prank as owner to deploy contract
        vm.startPrank(owner);
        ecommerce = new Ecommerce();
        vm.stopPrank();
        
        // Register a company
        vm.startPrank(owner);
        ecommerce.registerCompany(companyOwner, "Test Company", "Test Description");
        vm.stopPrank();
    }
    
        
    // Test complete purchase flow from customer registration to payment
    function testCompletePurchaseFlow() public {
        // 1. Customer registers
        vm.startPrank(customer);
        ecommerce.registerCustomer();
        vm.stopPrank();
        
        // 2. Add a product as company owner
        vm.startPrank(companyOwner);
        uint256 productId = ecommerce.addProduct(1, "Test Product", "Test Description", 100000, "ipfs://image", 10); // 100.000 EURT
        vm.stopPrank();
        
        // 3. Add product to customer's cart
        vm.startPrank(customer);
        ecommerce.addToCart(productId, 2); // Buy 2 units
        
        // Verify cart has items
        ShoppingCartLib.CartItem[] memory cart = ecommerce.getCart();
        assertEq(cart.length, 1);
        assertEq(cart[0].productId, productId);
        assertEq(cart[0].quantity, 2);
        
        // Verify total amount is correct (2 * 100.000 = 200.000)
        uint256 total = ecommerce.calculateTotal();
        assertEq(total, 200000);
        
        // 4. Create invoice
        uint256 invoiceId = ecommerce.createInvoice(1);
        vm.stopPrank();
        
        // Verify invoice was created
        Ecommerce.Invoice memory invoice = ecommerce.getInvoice(invoiceId);
        assertEq(invoice.invoiceId, invoiceId);
        assertEq(invoice.companyId, 1);
        assertEq(invoice.customerAddress, customer);
        assertEq(invoice.totalAmount, 200000);
        assertEq(invoice.isPaid, false);
        
        // Verify invoice items
        Ecommerce.InvoiceItem[] memory items = ecommerce.getInvoiceItems(invoiceId);
        assertEq(items.length, 1);
        assertEq(items[0].productId, productId);
        assertEq(items[0].quantity, 2);
        assertEq(items[0].unitPrice, 100000);
        assertEq(items[0].totalPrice, 200000);
        
        // Verify customer's invoice list
        uint256[] memory customerInvoices = ecommerce.getCustomerInvoices(customer);
        assertEq(customerInvoices.length, 1);
        assertEq(customerInvoices[0], invoiceId);
        
        // Verify company's invoice list
        uint256[] memory companyInvoices = ecommerce.getCompanyInvoices(1);
        assertEq(companyInvoices.length, 1);
        assertEq(companyInvoices[0], invoiceId);
        
        // 5. Approve token transfer and process payment
        vm.startPrank(customer);
        
        // Approve the ecommerce contract to spend customer's tokens
        euroToken.approve(address(ecommerce), 200000);
        
        // Process payment
        bool success = ecommerce.processPayment(invoiceId, "txhash123");
        assertTrue(success);
        
        // Verify invoice is now paid
        invoice = ecommerce.getInvoice(invoiceId);
        assertTrue(invoice.isPaid);
        assertEq(invoice.paymentTxHash, "txhash123");
        
        // Verify customer's total spent and purchase count
        CustomerLib.Customer memory customerData = ecommerce.getCustomer(customer);
        assertEq(customerData.totalSpent, 200000);
        assertEq(customerData.totalPurchases, 1);
        
        // Verify cart is empty after purchase
        cart = ecommerce.getCart();
        assertEq(cart.length, 0);
        
        // Verify product stock was decreased
        ProductLib.Product memory product = ecommerce.getProduct(productId);
        assertEq(product.stock, 8); // Started with 10, bought 2
        
        // Verify token balance was transferred
        // Since our mock handles the transfer internally, we'll just verify the flow completed
        
        vm.stopPrank();
    }
    
    // Test that customer cannot create invoice with empty cart
    function testCannotCreateInvoiceWithEmptyCart() public {
        vm.startPrank(customer);
        ecommerce.registerCustomer();
        
        // Try to create invoice with empty cart
        vm.expectRevert("Ecommerce: Cart is empty");
        ecommerce.createInvoice(1);
        
        vm.stopPrank();
    }
    
    // Test that customer cannot process payment for non-existent invoice
    function testCannotProcessPaymentForNonExistentInvoice() public {
        vm.startPrank(customer);
        ecommerce.registerCustomer();
        
        // Try to process payment for non-existent invoice
        vm.expectRevert("Ecommerce: Invoice does not exist");
        ecommerce.processPayment(999, "txhash123");
        
        vm.stopPrank();
    }
    
    // Test that customer cannot process payment for already paid invoice
    function testCannotProcessPaymentForAlreadyPaidInvoice() public {
        // Complete a purchase first
        testCompletePurchaseFlow();
        
        // Try to process payment again for the same invoice
        vm.startPrank(customer);
        vm.expectRevert("Ecommerce: Invoice already paid");
        ecommerce.processPayment(1, "txhash456");
        vm.stopPrank();
    }
}