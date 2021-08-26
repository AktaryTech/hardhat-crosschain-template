
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';

import * as dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';

dotenv.config();
/* This loads the variables in your .env file to `process.env` */

const { DEPLOYER_PRIVATE_KEY, ALCHEMY_RINKEBY_KEY, ALCHEMY_MUMBAI_KEY, ALCHEMY_ETHEREUM_KEY, ALCHEMY_POLYGON_KEY } = process.env;
export const ethUrl: string = ("https://eth-mainnet.alchemyapi.io/v2/" + ALCHEMY_ETHEREUM_KEY);
export const polyUrl: string = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_POLYGON_KEY}`;

const config = {
  solidity: '0.8.3',
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_RINKEBY_KEY}`,
      chainId: 4,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_MUMBAI_KEY}`,
      chainId: 80001,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
};

export default config;