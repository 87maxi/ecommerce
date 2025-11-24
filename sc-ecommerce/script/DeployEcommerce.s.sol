pragma solidity ^0.8.13;

// Import necessary libraries
import "forge-std/Script.sol";

// Import the main contract
import "../src/Ecommerce.sol";

// Import libraries (needed for storage layout)
import "../src/libraries/CompanyLib.sol";
import "../src/libraries/ProductLib.sol";
import "../src/libraries/CustomerLib.sol";
import "../src/libraries/ShoppingCartLib.sol";

contract DeployEcommerce is Script {
    function run() public {
        // Load private key from environment variable or use default
        uint256 deployerPrivateKey =
            vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));

        // Start broadcasting transactions from the deployer
        vm.startBroadcast(deployerPrivateKey);

        // Deploy contract
        Ecommerce ecommerce = new Ecommerce();

        // Stop broadcasting
        vm.stopBroadcast();

        // Print deployment information
        console2.log("Ecommerce contract deployed to:", address(ecommerce));
    }
}
