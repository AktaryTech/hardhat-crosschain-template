# Hardhat Crosschain Template
Do stuff across EVM chains... and test locally! 

This repo is set up with the following: 
1) Ethereum Mainnet (forked to run locally)
2) Polygon Mainnet (forked to run locally)
3) Rinkeby Testnet 
4) Mumbai Testnet

What's here currently is a test contract that retrieves its chainId (to prepare for deploying the same contract on multiple networks). It has a set of small unit tests to ensure you can deploy it to mulitple EVMs. 

In addition, there's a Dockerfile and docker-compose to set up two docker containers and images for concurrent testing on a local hardat network using forked ethereum mainnet and forked polygon mainnet.
**Note:** This creates two docker images that are 1.72 GB each. They're basically identical except for the script they run and the port they use on your computer. Perhaps there's a more efficient way to set this up? 

# Setup
1) Run `npm install`
2) Create `.env` based on `.env.example`
3) To run local unit tests, run `npm run test`
4) To set up Docker nodes for cross-chain testing, run `npm run docker`. To exit, press `Ctrl+C`. To remove the containers (if you're running this frequently this will slow down things), run `docker-compose down`.

# EXAMPLE:
0xNodes Ethereum contract ("Nodes Eth") has balance of 100 ETH: 80 belonging to other users, 20 available
Bob has 0 on Nodes Eth
0xNodes Polygon contract ("Nodes Eth") has 100 WETH: 80 belonging to other users, 20 available
Bob has 0 on Nodes Polygon

## USER DEPOSIT ON ETHEREUM:
[UI button -> user smart contract call] Bob deposits 10 ETH onto Nodes Eth such that it all to goes to Polygon
Nodes Eth now has balance of 110 ETH: 80 other users, 10 Bob, 20 available
[authorized smart contract call] Server has Nodes Eth set Bob's balance isOnChain property to false (meaning the assets are on the other chain). 
Nodes Eth now has balance of 110 ETH: 80 other users, 30 available
[authorized smart contract call] Server has Nodes Polygon increase Bob's balance by 10 WETH
Nodes Polygon now has balance of 100 WETH: ETH: 80 other users, 10 Bob, 10 available

## USER WITHDRAW ON ETHEREUM:
[UI button] Bob requests to withdraw his 10 WETH from Polygon
[smart contract call] Server gets Bob's balance on Nodes Polygon: it's still 10 WETH
[smart contract call] Server Bob's balance on Nodes Eth: it's still 0 ETH
[authorized smart contract call] Server decrease Bob's balance on Nodes Polygon to 0 WETH
Nodes Polygon now has balance of 100 WETH: 80 other users, 20 available 
[authorized smart contract call] Server increases Bob's Balance on Nodes Eth by 10 ETH
Nodes Eth now has balance of 110 ETH: 80 other users, 10 Bob, 20 available
[authorized smart contract call] Decrease Bob's & Nodes Eth's Balance by 10 ETH
Nodes ETh now has balance of 100 ETH: 80 other users, 20 available
[authorized smart contract call] Server sends Bob his 10 ETH 