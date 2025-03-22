// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PTHVault {
    mapping(address => uint256) public creditBalances;
    mapping(address => bool) public isAdminMap;
    uint256 public constant CREDIT_PRICE = 0.01 ether;

    event CreditsPurchased(address indexed buyer, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);

    constructor(address[] memory _admins) {
        for (uint i = 0; i < _admins.length; i++) {
            isAdminMap[_admins[i]] = true;
        }
    }

    function purchaseCredits(uint256 amount) external payable {
        require(msg.value >= amount * CREDIT_PRICE, "Insufficient payment");
        creditBalances[msg.sender] += amount;
        emit CreditsPurchased(msg.sender, amount);
    }

    function deposit(address user, uint256 amount) external payable {
        require(msg.value >= amount, "Insufficient payment");
        creditBalances[user] += amount;
        emit CreditsPurchased(user, amount);
    }

    function withdrawFunds(address payable to, uint256 amount) external {
        require(isAdminMap[msg.sender], "Only admins");
        require(amount <= address(this).balance, "Insufficient balance");
        to.transfer(amount);
        emit FundsWithdrawn(to, amount);
    }

    function vaultBalance() external view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
