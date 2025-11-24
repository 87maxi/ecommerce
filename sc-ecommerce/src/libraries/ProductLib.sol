pragma solidity ^0.8.13;

library ProductLib {
    struct Product {
        uint256 id;
        uint256 companyId;
        string name;
        string description;
        uint256 price;
        uint256 stock;
        string image;
        bool active;
    }

    struct ProductStorage {
        mapping(uint256 => Product) products;
        mapping(uint256 => mapping(uint256 => bool)) companyProductExists;
        mapping(uint256 => uint256[]) companyProducts;
        uint256 nextProductId;
    }

    event ProductAdded(uint256 productId, uint256 companyId, string name, uint256 price);
    event ProductUpdated(uint256 productId, string name, uint256 price);
    event StockUpdated(uint256 productId, uint256 stock);
    event ProductDeactivated(uint256 productId);
    event ProductActivated(uint256 productId);

    function addProduct(
        ProductStorage storage self,
        uint256 companyId,
        string memory name,
        string memory description,
        uint256 price,
        string memory image,
        uint256 stock
    ) external returns (uint256) {
        // Validate company exists
        require(companyId != 0, "ProductLib: Company does not exist");

        // Use post-increment to generate ID
        uint256 productId = ++self.nextProductId;

        self.products[productId] = Product({
            id: productId,
            companyId: companyId,
            name: name,
            description: description,
            price: price,
            stock: stock,
            image: image,
            active: true
        });

        self.companyProductExists[companyId][productId] = true;
        self.companyProducts[companyId].push(productId);

        emit ProductAdded(productId, companyId, name, price);
        return productId;
    }

    function updateProduct(
        ProductStorage storage self,
        uint256 productId,
        string memory name,
        string memory description,
        uint256 price,
        string memory image
    ) external {
        require(self.products[productId].id != 0, "ProductLib: Product does not exist");

        Product storage product = self.products[productId];
        product.name = name;
        product.description = description;
        product.price = price;
        product.image = image;

        emit ProductUpdated(productId, name, price);
    }

    function updateStock(ProductStorage storage self, uint256 productId, uint256 stock) external {
        require(self.products[productId].id != 0, "ProductLib: Product does not exist");

        self.products[productId].stock = stock;
        emit StockUpdated(productId, stock);
    }

    function decreaseStock(ProductStorage storage self, uint256 productId, uint256 quantity) external {
        require(self.products[productId].id != 0, "ProductLib: Product does not exist");
        require(self.products[productId].stock >= quantity, "ProductLib: Insufficient stock");

        self.products[productId].stock -= quantity;
        emit StockUpdated(productId, self.products[productId].stock);
    }

    function deactivateProduct(ProductStorage storage self, uint256 productId) external {
        require(self.products[productId].id != 0, "ProductLib: Product does not exist");
        require(self.products[productId].active, "ProductLib: Product already inactive");

        self.products[productId].active = false;
        emit ProductDeactivated(productId);
    }

    function activateProduct(ProductStorage storage self, uint256 productId) external {
        require(self.products[productId].id != 0, "ProductLib: Product does not exist");
        require(!self.products[productId].active, "ProductLib: Product already active");

        self.products[productId].active = true;
        emit ProductActivated(productId);
    }

    function getProduct(ProductStorage storage self, uint256 productId) external view returns (Product memory) {
        return self.products[productId];
    }

    function getProductsByCompany(ProductStorage storage self, uint256 companyId)
        external
        view
        returns (uint256[] memory)
    {
        return self.companyProducts[companyId];
    }

    function getAllProducts(ProductStorage storage self) external view returns (uint256[] memory) {
        // Handle case when no products exist
        if (self.nextProductId == 0) {
            return new uint256[](0);
        }
        
        uint256[] memory allProducts = new uint256[](self.nextProductId);
        uint256 count = 0;
        // Start from 1 and include nextProductId
        for (uint256 i = 1; i <= self.nextProductId; i++) {
            if (self.products[i].id != 0) {
                allProducts[count] = i;
                count++;
            }
        }

        // Create result array with exact size
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = allProducts[i];
        }
        return result;
    }

    function isProductAvailable(ProductStorage storage self, uint256 productId, uint256 quantity)
        external
        view
        returns (bool)
    {
        Product storage product = self.products[productId];
        return (product.id != 0 && product.active && product.stock >= quantity);
    }
}
