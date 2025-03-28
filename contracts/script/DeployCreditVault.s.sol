// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {CreditVault} from "../src/CreditVault.sol";

contract DeployCreditVault is Script {
    function run() external {
        vm.startBroadcast();
        CreditVault vault = new CreditVault(
            0xdD2e4fE4ee906BE1981C312EC6b14e0Fe694e28F, // SATC
            0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9, // Mock CCIP router
            0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 // Mock price feed
        );
        console.log("New CreditVault deployed at:", address(vault));
        console.log("SATC in vault:", address(vault.satc()));
        console.log("USDT in vault:", vault.usdt());
        vm.stopBroadcast();
    }
}
