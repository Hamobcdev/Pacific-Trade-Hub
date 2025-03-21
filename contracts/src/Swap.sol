// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Vault.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Swap is AccessControl {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant KYC_MANAGER_ROLE = keccak256("KYC_MANAGER_ROLE");

    // State variables
    Vault public vault;
    mapping(address => bool) public kycApproved;
    uint256 public dailyLimit = 500 ether; // $500 USD in ETH (adjustable)
    mapping(address => uint256) public dailySwapVolume;
    mapping(address => uint256) public lastSwapTimestamp;
    uint256 public spotRate;

    // Events
    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        uint256 amountIn,
        uint256 amountOut
    );
    event KYCUpdated(address indexed user, bool approved);
    event SpotRateUpdated(uint256 newRate);
    event DailyLimitUpdated(uint256 newLimit);

    // Constructor
    constructor(address _vault) {
        _setupRole(ADMIN_ROLE, msg.sender); // Deployer gets ADMIN_ROLE
        _setupRole(KYC_MANAGER_ROLE, msg.sender); // Deployer also KYC manager initially
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE); // ADMIN_ROLE manages itself
        _setRoleAdmin(KYC_MANAGER_ROLE, ADMIN_ROLE); // ADMIN_ROLE manages KYC_MANAGER_ROLE

        vault = Vault(_vault);
        spotRate = 2000 ether; // 1 ETH = $2000 USD (placeholder)
    }

    // Admin/KYC functions
    function setKYC(
        address user,
        bool approved
    ) external onlyRole(KYC_MANAGER_ROLE) {
        kycApproved[user] = approved;
        emit KYCUpdated(user, approved);
    }

    function setSpotRate(uint256 newRate) external onlyRole(ADMIN_ROLE) {
        spotRate = newRate;
        emit SpotRateUpdated(newRate);
    }

    function setDailyLimit(uint256 newLimit) external onlyRole(ADMIN_ROLE) {
        dailyLimit = newLimit;
        emit DailyLimitUpdated(newLimit);
    }

    function withdrawFunds(
        uint256 amount,
        address payable merchant
    ) external onlyRole(ADMIN_ROLE) {
        require(amount <= address(this).balance, "Insufficient balance");
        merchant.transfer(amount);
    }

    // Swap functions
    function swapFiatToCrypto(address user) external payable {
        require(kycApproved[user], "KYC required for fiat-to-crypto swaps");
        uint256 fiatAmountUSD = (msg.value * spotRate) / 1 ether;
        require(fiatAmountUSD <= dailyLimit, "Exceeds daily limit");

        if (block.timestamp >= lastSwapTimestamp[user] + 1 days) {
            dailySwapVolume[user] = 0;
            lastSwapTimestamp[user] = block.timestamp;
        }

        require(
            dailySwapVolume[user] + fiatAmountUSD <= dailyLimit,
            "Daily limit exceeded"
        );
        dailySwapVolume[user] += fiatAmountUSD;

        vault.deposit{value: msg.value}(user, msg.value);
        emit SwapExecuted(user, address(0), msg.value, msg.value);
    }

    function swapCryptoToFiat(
        address payable user,
        uint256 amount
    ) external onlyRole(ADMIN_ROLE) {
        require(amount <= vault.vaultBalance(), "Insufficient vault balance");
        vault.withdrawToMerchant(amount, address(this));
        user.transfer(amount);
        emit SwapExecuted(user, address(this), amount, amount);
    }

    function swapCryptoToCrypto() external pure {
        revert("Crypto-to-crypto swaps not yet implemented");
    }

    // View functions
    function getUserDailyVolume(address user) external view returns (uint256) {
        if (block.timestamp >= lastSwapTimestamp[user] + 1 days) {
            return 0;
        }
        return dailySwapVolume[user];
    }

    // Receive ETH
    receive() external payable {}
}
