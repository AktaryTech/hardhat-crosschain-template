//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
contract HelloWorlds {
    function getChain() public view returns (uint, string memory) {
        uint chainId = block.chainid; 
        if (chainId == 4) {
            return (chainId, "rinkeby");
        }
        else if (chainId == 80001) {
            return (chainId, "mumbai");
        }
        else if (chainId == 1) {
            return (chainId, "ethereum");
        }
        else if (chainId == 137) {
            return (chainId, "polygon");
        }
        else {
            return (chainId, "IDK what this is");
        }
    }

}