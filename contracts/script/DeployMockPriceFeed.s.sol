// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockPriceFeed} from "../mock/MockPriceFeed.sol";

contract DeployMockPriceFeed is Script {
    function run() external {
        vm.startBroadcast();
        MockPriceFeed priceFeed = new MockPriceFeed();
        vm.stopBroadcast();
        console.log("MockPriceFeed deployed at:", address(priceFeed));
    }
}
