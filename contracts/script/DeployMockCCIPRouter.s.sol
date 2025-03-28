// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockCCIPRouter} from "../mock/MockCCIPRouter.sol";

contract DeployMockCCIPRouter is Script {
    function run() external {
        vm.startBroadcast();
        MockCCIPRouter ccipRouter = new MockCCIPRouter();
        vm.stopBroadcast();
        console.log("MockCCIPRouter deployed at:", address(ccipRouter));
    }
}
