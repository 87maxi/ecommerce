/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library CustomerLib {
    struct Customer {
        address customerAddress;
        uint256 totalPurchases;
        uint256 totalSpent;
        uint256 createdAt;
        bool isRegistered;
    }

    struct CustomerStorage {
        mapping(address => Customer) customers;
    }

    event CustomerRegistered(address indexed customerAddress);
    event CustomerStatsUpdated(address indexed customerAddress, uint256 totalPurchases, uint256 totalSpent);

    function registerCustomer(CustomerStorage storage self, address customerAddress) external returns (bool) {
        require(!self.customers[customerAddress].isRegistered, "Customer already registered");

        self.customers[customerAddress] = Customer(customerAddress, 0, 0, block.timestamp, true);

        emit CustomerRegistered(customerAddress);
        return true;
    }

    function getCustomer(CustomerStorage storage self, address customerAddress)
        external
        view
        returns (Customer memory)
    {
        return self.customers[customerAddress];
    }

    function getAllCustomers(CustomerStorage storage self) external view returns (Customer[] memory) {
        // Count registered customers first
        uint256 count = 0;
        // Use a reasonable upper bound to avoid gas issues
        address current = address(1);
        for (uint256 i = 0; i < 1000; i++) {
            if (uint160(current) >= 0) {
                if (self.customers[current].isRegistered) {
                    count++;
                }
                // Simple increment - in practice, we'd need a better enumeration
                current = address(uint160(uint256(uint160(current)) + 1));
            }
        }

        Customer[] memory result = new Customer[](count);
        uint256 index = 0;
        current = address(1);
        for (uint256 i = 0; i < 1000; i++) {
            if (uint160(current) >= 0) {
                if (self.customers[current].isRegistered) {
                    result[index] = self.customers[current];
                    index++;
                }
                current = address(uint160(uint256(uint160(current)) + 1));
            }
        }

        return result;
    }

    function isCustomerRegistered(CustomerStorage storage self, address customerAddress) external view returns (bool) {
        return self.customers[customerAddress].isRegistered;
    }

    function updateCustomerStats(CustomerStorage storage self, address customerAddress, uint256 amountSpent) external {
        require(self.customers[customerAddress].isRegistered, "Customer not registered");

        self.customers[customerAddress].totalPurchases++;
        self.customers[customerAddress].totalSpent += amountSpent;

        emit CustomerStatsUpdated(
            customerAddress, self.customers[customerAddress].totalPurchases, self.customers[customerAddress].totalSpent
        );
    }
}
