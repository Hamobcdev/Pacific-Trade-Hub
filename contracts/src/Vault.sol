// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Vault {
    address public admin;
    mapping(address => uint256) public userBalances;
    uint256 public vaultBalance;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function deposit(address user, uint256 amount) external payable {
        require(msg.value == amount, "Incorrect ETH amount");
        userBalances[user] += amount;
        vaultBalance += amount;
    }

    function withdrawToMerchant(
        uint256 amount,
        address merchant
    ) external onlyAdmin {
        require(vaultBalance >= amount, "Insufficient balance");
        vaultBalance -= amount;
        payable(merchant).transfer(amount);
    }
}
