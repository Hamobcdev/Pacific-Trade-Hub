// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {SATCreditToken} from "../src/SATCreditToken.sol";

contract DeploySATCreditToken is Script {
    function run() external {
        vm.startBroadcast();
        SATCreditToken satc = new SATCreditToken();
        satc.setVault(0xFcC343846312D381cE87f7247463e9e6f17A3eaF);
        vm.stopBroadcast();
        console.log("SATCreditToken deployed at:", address(satc));
    }
}
