# Hardhat Crosschain Template
Do stuff across EVM chains... and test locally! 

This repo is set up with the following: 
1) Ethereum Mainnet (forked to run locally)
2) Polygon Mainnet (forked to run locally)
3) Rinkeby Testnet 
4) Mumbai Testnet

What's here currently is a test contract that retrieves its chainId (to prepare for deploying the same contract on multiple networks). It has a set of small unit tests to ensure you can deploy it to mulitple EVMs. 

In addition, there are configurations to be able to run and test on two networks concurrently.

# Setup
1) Run `yarn` to install dependencies
2) Create `.env` based on `.env.example`. Leave the `HH_CHAIN_ID` as is, and add a private key to deploy as well as provider URLs, which are retrievable on Infura or Alchemy.

# Scripts
`yarn fork:ethereum` - runs fork of Ethereum mainnet
`yarn fork:polygon` - runs fork of Polygon mainnet
`yarn fork:both` - runs both local forks
`yarn deploy` - deploys the `HelloWorlds` contract
`yarn clean` - removes old build
`yarn compile` - compiles contracts
`yarn test` - runs tests in `./test`

