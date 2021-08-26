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
