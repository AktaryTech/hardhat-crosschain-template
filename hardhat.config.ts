
import '@nomiclabs/hardhat-waffle';
import 'hardhat-deploy';
import { task } from 'hardhat/config';
import * as dotenv from 'dotenv';

dotenv.config();
/* This loads the variables in your .env file to `process.env` */

const { 
  HH_CHAIN_ID,
  DEPLOYER_PRIVATE_KEY, 
  RINKEBY_PROVIDER_URL, 
  ETHEREUM_PROVIDER_URL,
  POLYGON_PROVIDER_URL,
  MUMBAI_PROVIDER_URL, 
} = process.env;
export const ethUrl: string = ETHEREUM_PROVIDER_URL || "";
export const polyUrl: string = POLYGON_PROVIDER_URL || "";

const MOCK_CHAIN_ID = HH_CHAIN_ID ? parseInt(HH_CHAIN_ID) : 31337;

const config = {
  solidity: '0.8.3',
  networks: {
    hardhat: {
			chainId: MOCK_CHAIN_ID
		},
    rinkeby: {
      url: RINKEBY_PROVIDER_URL,
      chainId: 4,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },
    mumbai: {
      url: MUMBAI_PROVIDER_URL,
      chainId: 80001,
      accounts: [`0x${DEPLOYER_PRIVATE_KEY}`],
    },
  },
  namedAccounts: {
    deployer: 0,
  },
};

task(
	'customFork',
	"Sets the name of the fork, so it's visible in deployment scripts"
)
	.addParam('n', 'name of forked network')
	.setAction(async (taskArgs, hre) => {
		hre.forkName = taskArgs.n;
		let url;
		let port;
		if (hre.forkName === 'ethereum') {
			url = ethUrl;
			port = 8545;
		} else if (hre.forkName === 'polygon') {
			url = polyUrl;
			port = 8546;
		} else {
			throw 'Incorrect fork name!';
		}
		await hre.run('node', {
			fork: url,
			port: port
		});
	});


export default config;