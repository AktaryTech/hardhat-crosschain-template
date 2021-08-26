import { expect } from "chai";
import { deployContract, MockProvider} from 'ethereum-waffle';
import { ethUrl, polyUrl } from '../hardhat.config';
import * as data from '../artifacts/contracts/HelloWorlds.sol/HelloWorlds.json'
import { BigNumber, Contract, Wallet, ContractFactory } from "ethers";
import config from "../hardhat.config";

describe("Hello Worlds", function () {
  it("Should return the ethereum mainnet chainid", async function () {
    const options = {fork: ethUrl}
    const provider: MockProvider = new MockProvider({ganacheOptions: options});
    const wallets: Wallet[] = provider.getWallets();
    const deployWallet: Wallet = wallets[0];
    const helloWorldsContract: Contract = await deployContract(deployWallet, {abi: data.abi, bytecode: data.bytecode});
    const resultNumber: BigNumber = BigNumber.from(1);
    const chain: string = "ethereum";
    const res = await helloWorldsContract.getChain();
    expect(res[0].eq(resultNumber));
    expect(res[1]).to.equal(chain);
  });
  
  it("Should return the polygon mainnet chainid", async function () {
    const options = {fork: polyUrl, _chainId: 137};
    const provider: MockProvider = new MockProvider({ganacheOptions: options});
    const wallets: Wallet[] = provider.getWallets();
    const deployWallet: Wallet = wallets[0];
    const helloWorldsContract: Contract = await deployContract(deployWallet, {abi: data.abi, bytecode: data.bytecode});
    const resultNumber: BigNumber = BigNumber.from(137);
    const chain: string = "polygon";
    const res = await helloWorldsContract.getChain();
    expect(res[0].eq(resultNumber));
    expect(res[1]).to.equal(chain);
  });

  it("Should return the rinkeby testnet chainid", async function () {
    const options = {fork: config.networks.rinkeby.url, _chainId: config.networks.rinkeby.chainId};
    const provider: MockProvider = new MockProvider({ganacheOptions: options});
    const wallets: Wallet[] = provider.getWallets();
    const deployWallet: Wallet = wallets[0];
    const helloWorldsContract: Contract = await deployContract(deployWallet, {abi: data.abi, bytecode: data.bytecode});
    const resultNumber: BigNumber = BigNumber.from(4);
    const chain: string = "rinkeby";
    const res = await helloWorldsContract.getChain();
    expect(res[0].eq(resultNumber));
    expect(res[1]).to.equal(chain);
  });

  it("Should return the mumbai testnet chainid", async function () {
    const options = {fork: config.networks.mumbai.url, _chainId: config.networks.mumbai.chainId};
    const provider: MockProvider = new MockProvider({ganacheOptions: options});
    const wallets: Wallet[] = provider.getWallets();
    const deployWallet: Wallet = wallets[0];
    const helloWorldsContract: Contract = await deployContract(deployWallet, {abi: data.abi, bytecode: data.bytecode});
    const resultNumber: BigNumber = BigNumber.from(80001);
    const chain: string = "mumbai";
    const res = await helloWorldsContract.getChain();
    expect(res[0].eq(resultNumber));
    expect(res[1]).to.equal(chain);
  });
});