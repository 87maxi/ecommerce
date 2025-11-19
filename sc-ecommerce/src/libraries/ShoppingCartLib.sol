/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ProductLib} from "../libraries/ProductLib.sol";

library ShoppingCartLib {
    struct CartItem {
        uint256 productId;
        uint256 quantity;
    }

    struct ShoppingCart {
        CartItem[] items;
        uint256 itemCount;
    }

    struct ShoppingCartStorage {
        mapping(address => ShoppingCart) carts;
        mapping(address => mapping(uint256 => uint256)) itemIndex;
    }

    event ItemAddedToCart(address indexed customer, uint256 indexed productId, uint256 quantity);
    event ItemRemovedFromCart(address indexed customer, uint256 indexed productId);
    event ItemQuantityUpdated(address indexed customer, uint256 indexed productId, uint256 quantity);
    event CartCleared(address indexed customer);

    function addToCart(
        ShoppingCartStorage storage self,
        ProductLib.ProductStorage storage productStorage,
        address customer,
        uint256 productId,
        uint256 quantity
    ) external returns (bool) {
        require(quantity > 0, "Quantity must be greater than 0");
        require(productStorage.products[productId].id != 0, "Product does not exist");
        require(productStorage.products[productId].isActive, "Product is not active");
        require(productStorage.products[productId].stock >= quantity, "Insufficient stock");
        
        ShoppingCart storage cart = self.carts[customer];
        
        // Check if product already in cart
        uint256 index = self.itemIndex[customer][productId];
        if (index < cart.items.length && cart.items[index].productId == productId) {
            // Update existing item
            cart.items[index].quantity += quantity;
        } else {
            // Add new item
            cart.items.push(CartItem(productId, quantity));
            self.itemIndex[customer][productId] = cart.items.length - 1;
            cart.itemCount++;
        }
        
        emit ItemAddedToCart(customer, productId, quantity);
        return true;
    }

    function removeFromCart(
        ShoppingCartStorage storage self,
        address customer,
        uint256 productId
    ) external returns (bool) {
        ShoppingCart storage cart = self.carts[customer];
        uint256 index = self.itemIndex[customer][productId];
        
        // Validate item exists in cart at this index
        if (index >= cart.items.length || cart.items[index].productId != productId) {
            return false;
        }
        
        // Move last item to deleted position if not the last item
        if (index < cart.items.length - 1) {
            cart.items[index] = cart.items[cart.items.length - 1];
            // Update index for the moved item
            self.itemIndex[customer][cart.items[index].productId] = index;
        }
        
        // Remove last item
        cart.items.pop();
        cart.itemCount--;
        
        // Clear the index
        delete self.itemIndex[customer][productId];
        
        emit ItemRemovedFromCart(customer, productId);
        return true;
    }

    function updateQuantity(
        ShoppingCartStorage storage self,
        ProductLib.ProductStorage storage productStorage,
        address customer,
        uint256 productId,
        uint256 quantity
    ) external returns (bool) {
        require(quantity > 0, "Quantity must be greater than 0");
        
        ShoppingCart storage cart = self.carts[customer];
        uint256 index = self.itemIndex[customer][productId];
        
        // Validate item exists in cart
        if (index >= cart.items.length || cart.items[index].productId != productId) {
            return false;
        }
        
        // Check stock availability
        require(productStorage.products[productId].stock >= quantity, "Insufficient stock");
        
        cart.items[index].quantity = quantity;
        
        emit ItemQuantityUpdated(customer, productId, quantity);
        return true;
    }

    function getCart(ShoppingCartStorage storage self, address customer)
        external
        view
        returns (CartItem[] memory)
    {
        return self.carts[customer].items;
    }

    function clearCart(ShoppingCartStorage storage self, address customer) external {
        delete self.carts[customer];
        delete self.itemIndex[customer];
        
        emit CartCleared(customer);
    }

    function calculateTotal(
        ShoppingCartStorage storage self,
        ProductLib.ProductStorage storage productStorage,
        address customer
    ) external view returns (uint256) {
        uint256 total = 0;
        CartItem[] storage items = self.carts[customer].items;
        
        for (uint256 i = 0; i < items.length; i++) {
            uint256 productId = items[i].productId;
            uint256 quantity = items[i].quantity;
            
            // Validate product still exists and is active
            if (productStorage.products[productId].id != 0 && 
                productStorage.products[productId].isActive) {
                total += productStorage