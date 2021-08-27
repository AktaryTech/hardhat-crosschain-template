// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// this is IWeth9 but with a more general name for other chains
// WMATIC is the same contract 
// url: https://polygonscan.com/address/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270#code
interface IWrappedNativeCurrency {
    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);

    function deposit() external payable;

    /// @param wad The amount of wrapped native currency to withdraw into the native currency
    function withdraw(uint256 wad) external;
}
