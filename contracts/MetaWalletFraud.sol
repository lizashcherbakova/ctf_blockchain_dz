// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MetaWalletFraud {

    function empty() external {}

    function transferTokens(IERC20 token, address _to, uint256 _amount) external {
        bool success = token.transfer(_to, _amount);
        require(success, "Again nothing worked:((");
    }
}
