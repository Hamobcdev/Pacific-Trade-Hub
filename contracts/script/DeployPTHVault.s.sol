// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {PTHVault} from "../src/PTHVault.sol";
import "forge-std/console.sol"; // Add console for logging

contract DeployPTHVault is Script {
    event VaultDeployed(address indexed vaultAddress); // Indexed for easier filtering

    function run() external {
        vm.startBroadcast();
        address[] memory admins = new address[](1);
        admins[0] = msg.sender; // Keystore provides the sender
        PTHVault vault = new PTHVault(admins);
        emit VaultDeployed(address(vault)); // Log via event
        console.log("Vault deployed at:", address(vault)); // Log to terminal
        vm.stopBroadcast();
    }
}
