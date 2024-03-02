// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
Стань владельцем контракта
*/
contract Telephone {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function changeOwner(address _owner) public {
        if (tx.origin != msg.sender) {
            owner = _owner;
        }
    }
}
