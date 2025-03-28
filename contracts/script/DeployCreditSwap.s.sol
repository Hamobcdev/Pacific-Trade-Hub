// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {CreditSwap} from "../src/CreditSwap.sol";

contract DeployCreditSwap is Script {
    function run(address satcAddress, address vaultAddress) external {
        vm.startBroadcast();
        CreditSwap swap = new CreditSwap(satcAddress, vaultAddress);
        vm.stopBroadcast();
        console.log("CreditSwap deployed at:", address(swap));
    }
}
