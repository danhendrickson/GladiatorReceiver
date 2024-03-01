// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Gladii is ERC20 {
    constructor(uint256 initialSupply) ERC20("Gladii", "GLDI") {
        _mint(msg.sender, initialSupply);
    }
}