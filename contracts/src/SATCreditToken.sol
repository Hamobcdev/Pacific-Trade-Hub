// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SATCreditToken is ERC20, Ownable {
    address public vault;

    constructor() ERC20("SAT Credit", "SATC") Ownable(msg.sender) {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function setVault(address _vault) external onlyOwner {
        require(vault == address(0), "Vault already set");
        vault = _vault;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == vault, "Only vault can mint");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(
            msg.sender == vault || msg.sender == owner(),
            "Only vault or owner"
        );
        _burn(from, amount);
    }
}
