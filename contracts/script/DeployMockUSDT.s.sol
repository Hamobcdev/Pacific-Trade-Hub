// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockUSDT} from "../mock/MockUSDT.sol";

contract DeployMockUSDT is Script {
    function run() external {
        vm.startBroadcast();
        MockUSDT usdt = new MockUSDT();
        vm.stopBroadcast();
        console.log("MockUSDT deployed at:", address(usdt));
    }
}
