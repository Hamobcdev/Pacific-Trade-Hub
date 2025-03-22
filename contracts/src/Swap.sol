// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PTHVault.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Swap is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant KYC_MANAGER_ROLE = keccak256("KYC_MANAGER_ROLE");

    PTHVault public vault;
    mapping(address => bool) public kycApproved;
    uint256 public dailyLimit = 500 ether;
    mapping(address => uint256) public dailySwapVolume;
    mapping(address => uint256) public lastSwapTimestamp;
    uint256 public spotRate;

    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        uint256 amountIn,
        uint256 amountOut
    );
    event KYCUpdated(address indexed user, bool approved);
    event SpotRateUpdated(uint256 newRate);
    event DailyLimitUpdated(uint256 newLimit);

    constructor(address payable _vault) {
        // Fixed: address payable
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(KYC_MANAGER_ROLE, msg.sender);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(KYC_MANAGER_ROLE, ADMIN_ROLE);

        vault = PTHVault(_vault);
        spotRate = 2000 ether;
    }

    function setKYC(
        address user,
        bool approved
    ) external onlyRole(KYC_MANAGER_ROLE) {
        kycApproved[user] = approved; // ~5k gas
        emit KYCUpdated(user, approved);
    }

    function setSpotRate(uint256 newRate) external onlyRole(ADMIN_ROLE) {
        spotRate = newRate; // ~5k gas
        emit SpotRateUpdated(newRate);
    }

    function setDailyLimit(uint256 newLimit) external onlyRole(ADMIN_ROLE) {
        dailyLimit = newLimit; // ~5k gas
        emit DailyLimitUpdated(newLimit);
    }

    function withdrawFunds(
        uint256 amount,
        address payable merchant
    ) external onlyRole(ADMIN_ROLE) {
        vault.withdrawFunds(merchant, amount); // ~15k gas (call + transfer)
    }

    function swapFiatToCrypto(address user) external payable {
        require(kycApproved[user], "KYC required");
        uint256 fiatAmountUSD = (msg.value * spotRate) / 1 ether;
        require(fiatAmountUSD <= dailyLimit, "Exceeds daily limit");

        if (block.timestamp >= lastSwapTimestamp[user] + 1 days) {
            dailySwapVolume[user] = 0; // ~5k gas
            lastSwapTimestamp[user] = block.timestamp; // ~5k gas
        }

        require(
            dailySwapVolume[user] + fiatAmountUSD <= dailyLimit,
            "Daily limit exceeded"
        );
        dailySwapVolume[user] += fiatAmountUSD; // ~5k gas

        vault.deposit{value: msg.value}(user, msg.value); // ~20k gas (call + storage)
        emit SwapExecuted(user, address(0), msg.value, msg.value);
    }

    function swapCryptoToFiat(
        address payable user,
        uint256 amount
    ) external onlyRole(ADMIN_ROLE) {
        require(amount <= vault.vaultBalance(), "Insufficient vault balance");
        vault.withdrawFunds(user, amount); // ~15k gas
        emit SwapExecuted(user, address(this), amount, amount);
    }

    function swapCryptoToCrypto() external pure {
        revert("Not implemented");
    }

    function getUserDailyVolume(address user) external view returns (uint256) {
        if (block.timestamp >= lastSwapTimestamp[user] + 1 days) {
            return 0;
        }
        return dailySwapVolume[user];
    }

    receive() external payable {}
}
