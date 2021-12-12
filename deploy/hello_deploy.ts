import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, DeployResult } from 'hardhat-deploy/types';
import { deployContract } from "../utils/deploy"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  try {
    const res: DeployResult = await deployContract(hre, "HelloWorlds", []);
    console.log(`HelloWorlds on ChainID ${await hre.getChainId()} deployed to ${res.address}`);
  } catch (error) {
    
  }
};

export default func;
