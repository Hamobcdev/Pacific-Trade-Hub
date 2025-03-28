// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/ccip/interfaces/IRouterClient.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/shared/interfaces/AggregatorV3Interface.sol";
import {SATCreditToken} from "./SATCreditToken.sol";
import {Client} from "@chainlink/contracts-ccip/ccip/libraries/Client.sol";
import {console} from "forge-std/console.sol";

contract CreditVault {
    SATCreditToken public satc;
    IRouterClient public ccipRouter;
    AggregatorV3Interface public priceFeed;
    address public usdt = 0xb226f411D92ECf1Cf1FC3a7e05b7ABa2FEA43021; // New MockUSDT
    address public usdc = 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582;
    address public pol = 0x0000000000000000000000000000000000001010;
    mapping(address => uint256) public reserves;

    event CryptoDeposited(
        address indexed user,
        address token,
        uint256 amount,
        uint256 satcAmount
    );

    constructor(address _satc, address _ccipRouter, address _priceFeed) {
        satc = SATCreditToken(_satc);
        ccipRouter = IRouterClient(_ccipRouter);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function depositCrypto(address token, uint256 amount) external {
        require(
            token == usdt || token == usdc || token == pol,
            "Invalid token"
        );
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        reserves[token] += amount;
        uint256 satcAmount = calculateSATC(amount, token);
        satc.mint(msg.sender, satcAmount);
        emit CryptoDeposited(msg.sender, token, amount, satcAmount);
    }

    function calculateSATC(
        uint256 amount,
        address token
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData(); // USDT/USD feed (8 decimals)
        uint256 usdPrice = uint256(price) / 1e8; // Normalize to 1 USD = 1
        uint256 wstPerUsd = 278; // Mock 2.78 WST/USD
        uint256 tokenDecimals = (token == usdt) ? 6 : 18; // USDT = 6, others = 18
        return (amount * usdPrice * wstPerUsd) / 10 ** tokenDecimals;
    }

    function withdraw(uint256 amount, address to) external {
        satc.burn(msg.sender, amount);
        uint256 cryptoAmount = (amount * 1e18) / (278 * 1e8); // Reverse calc (mock)
        IERC20(usdt).transfer(to, cryptoAmount);
        reserves[usdt] -= cryptoAmount;
    }

    function getReserves()
        external
        view
        returns (uint256 usdtBal, uint256 usdcBal, uint256 polBal)
    {
        return (reserves[usdt], reserves[usdc], reserves[pol]);
    }

    function crossChainTransfer(
        uint64 destinationChainSelector,
        bytes memory message,
        uint256 amount
    ) external payable {
        satc.burn(msg.sender, amount);
        Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
            receiver: message,
            data: abi.encode(amount),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });
        bytes32 messageId = ccipRouter.ccipSend{value: msg.value}(
            destinationChainSelector,
            ccipMessage
        );
        console.log("CCIP Message ID:", uint256(messageId));
    }
}
