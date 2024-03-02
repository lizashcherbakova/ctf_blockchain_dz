// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
Этот контракт использует библиотеку для хранения двух разных времен для двух разных часовых поясов. 
Конструктор создает два экземпляра библиотеки для каждого времени сохранения.

Цель этого уровня — заявить права владения предоставленным вам экземпляром.

Вспомни как работает delegatecall и приведение типов в solidity
*/

contract Preservation {
    // контракты с публичной библиотекой
    address public timeZoneLibrary;
    address public owner;
    uint storedTime;
    // Устанавливает сигнатуру функции для вызова delegatecall
    bytes4 constant setTimeSignature = bytes4(keccak256("setTime(uint256)"));

    constructor(address _timeZoneLibraryAddress, address _owner) {
        timeZoneLibrary = _timeZoneLibraryAddress;
        owner = _owner;
    }

    // установить время для часового пояса
    function setTime(uint _timeStamp) public {
        timeZoneLibrary.delegatecall(
            abi.encodePacked(setTimeSignature, _timeStamp)
        );
    }
}

// Простой библиотечный контракт для установки времени
contract LibraryContract {
    // хранит временную метку
    uint storedTime;

    function setTime(uint _time) public {
        storedTime = _time;
    }
}
