/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {CompanyLib} from "../libraries/CompanyLib.sol";

library ProductLib {
    struct Product {
        uint256 id;
        uint256 companyId;
        string name;
        string description;
        uint256 price;
        string imageHash;
        uint256 stock;
        bool isActive;
    }

    struct ProductStorage {
        mapping(uint256 => Product) products;
        mapping(uint256 => uint256) productIdsByCompany;
        uint256 nextProductId;
    }

    event ProductAdded(uint256 indexed productId, uint256 indexed companyId, string name, uint256 price);
    event ProductUpdated(uint256 indexed productId, string name, uint256 price);
    event ProductStatusChanged(uint256 indexed productId, bool isActive);
    event StockUpdated(uint256 indexed productId, uint256 stock);

    function addProduct(
        ProductStorage storage self,
        CompanyLib.CompanyStorage storage companyStorage,
        uint256 companyId,
        string memory name,
        string memory description,
        uint256 price,
        string memory imageHash,
        uint256 stock
    ) external returns (uint256) {
        // Verify company exists and is active
        require(companyStorage.companies[companyId].id != 0, "Company does not exist");
        require(companyStorage.companies[companyId].isActive, "Company is not active");
        
        uint256 productId = self.nextProductId;
        
        self.products[productId] = Product(
            productId,
            companyId,
            name,
            description,
            price,
            imageHash,
            stock,
            true
        );
        
        self.nextProductId++;
        
        emit ProductAdded(productId, companyId, name, price);
        return productId;
    }

    function updateProduct(
        ProductStorage storage self,
        uint256 productId,
        string memory name,
        string memory description,
        uint256 price,
        string memory imageHash
    ) external {
        require(self.products[productId].id != 0, "Product does not exist");
        require(self.products[productId].isActive, "Product is not active");
        
        Product storage product = self.products[productId];
        product.name = name;
        product.description = description;
        product.price = price;
        product.imageHash = imageHash;
        
        emit ProductUpdated(productId, name, price);
    }

    function updateStock(
        ProductStorage storage self,
        uint256 productId,
        uint256 stock
    ) external {
        require(self.products[productId].id != 0, "Product does not exist");
        
        self.products[productId].stock = stock;
        
        emit StockUpdated(productId, stock);
    }

    function decreaseStock(
        ProductStorage storage self,
        uint256 productId,
        uint256 quantity
    ) external {
        require(self.products[productId].id != 0, "Product does not exist");
        require(self.products[productId].stock >= quantity, "Insufficient stock");
        
        self.products[productId].stock -= quantity;
        
        emit StockUpdated(productId, self.products[productId].stock);
    }

    function deactivateProduct(ProductStorage storage self, uint256 productId) external {
        require(self.products[productId].id != 0, "Product does not exist");
        require(self.products[productId].isActive, "Product already inactive");
        
        self.products[productId].isActive = false;
        
        emit ProductStatusChanged(productId, false);
    }

    function activateProduct(ProductStorage storage self, uint256 productId) external {
        require(self.products[productId].id != 0, "Product does not exist");
        require(!self.products[productId].isActive, "Product already active");
        
        self.products[productId].isActive = true;
        
        emit ProductStatusChanged(productId, true);
    }

    function getProduct(ProductStorage storage self, uint256 productId)
        external
        view
        returns (Product memory)
    {
        return self.products[productId];
    }

    function getProductsByCompany(ProductStorage storage self, uint256 companyId)
        external
        view
        returns (Product[] memory)
    {
        // Count products first
        uint256 count = 0;
        for (uint256 i = 0; i < self.nextProductId; i++) {
            if (self.products[i].companyId == companyId && 
                self.products[i].id != 0 && 
                self.products[i].isActive) {
                count++;
            }
        }
        
        Product[] memory result = new Product[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < self.nextProductId; i++) {
            if (self.products[i].companyId == companyId && 
                self.products[i].id != 0 && 
                self.products[i].isActive) {
                result[index] = self.products[i];
                index++;
            }
        }
        
        return result;
    }

    function getAllProducts(ProductStorage storage self)
        external
        view
        returns (Product[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < self.nextProductId; i++) {
            if (self.products[i].id != 0 && self.products[i].isActive) {
                count++;
            }
        }
        
