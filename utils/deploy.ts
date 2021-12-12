import { HardhatRuntimeEnvironment } from 'hardhat/types/runtime';

const deployContract = async (
	hre: HardhatRuntimeEnvironment,
	contractName: string,
	args: any[] = []
) => {
	const {
		deployments: { deploy },
		getNamedAccounts
	} = hre;
	const { deployer } = await getNamedAccounts();

	const config = {
		log: true,
		from: deployer,
		args
	};

	return await deploy(contractName, config);
};

export { deployContract };
