// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICoin {
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract CoinMid {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function transferOutTokens(address coinAddress, address from, address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can use this function");
        ICoin coin = ICoin(coinAddress);
        //coin.approve(address(this), amount);
        coin.transferFrom(from, to, amount);
    }
}
