import { ethers, waffle, network, deployments, getNamedAccounts } from "hardhat";
import { expect } from "chai";
import { Signer, Contract, ContractFactory } from "ethers";
import * as IERC20Meta from '../artifacts/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol/IERC20Metadata.json'
import * as IWrappedNativeCurrency from '../artifacts/contracts/interfaces/IWrappedNativeCurrency.sol/IWrappedNativeCurrency.json';
import time from "../utils/time";

describe("Bridge - unit tests", function () {
    let [deployer, user]: Signer[] = [];
    let bridge: Contract;
    let mockWrappedToken: Contract;
    let mockERC20: Contract;
    beforeEach("Set up & deploy bridge + mocks", async function () {
        [deployer, user] = await ethers.getSigners();
        const bridgeFactory: ContractFactory = await ethers.getContractFactory("Bridge", deployer);
        mockWrappedToken = await waffle.deployMockContract(deployer, IWrappedNativeCurrency.abi);
        mockERC20 = await waffle.deployMockContract(deployer, IERC20Meta.abi);
        bridge = await bridgeFactory.deploy(mockWrappedToken.address, [mockERC20.address]);
        
    });

    describe("Constructor", function () {
        it("Wrapped address set properly", async function () {
            expect(await bridge.wrappedToken()).to.equal(mockWrappedToken.address);
        });
        it("Token Bridgeability set properly", async function () {
            expect(await bridge.tokenDetails(mockERC20.address)[1]);
        });
    });
    
    describe("Deposit", function () {
        let resp: any;
        beforeEach("User deposits 5 units of the native currency and 10 of the mockErc20", async function () {
            // await mockERC20.mock.transfer
            // .withArgs(await user.getAddress(), ethers.utils.parseEther("10"))
            // .returns(true);
            await mockERC20.mock.balanceOf
            .withArgs(bridge.address)
            .returns(ethers.utils.parseEther("0"));
            await mockERC20.mock.balanceOf
            .withArgs(await user.getAddress())
            .returns(ethers.utils.parseEther("10"));
            await mockWrappedToken.mock.deposit
            .returns();
            resp = await bridge.connect(user)
            .deposit([mockERC20.address], [ethers.utils.parseEther("10")], {value: ethers.utils.parseEther("5")});
        });
        
        it("Deposit event is correct", async function () {
            expect(resp).to.emit(bridge, "Deposit")
            .withArgs(
                await user.getAddress(), 
                [mockERC20.address], 
                [ethers.utils.parseEther("10")], 
                ethers.utils.parseEther("5"), 
                await time.latest()
            );
        });
        
    });
    
    // deposit
        // deposit event is correct
        // user balance set properly
        // token balance set properly
        // revert if bridging for a token is not allowed
        // revert if deposit is zero
    
    // withdraw
        // withdraw event is correct
        // revert if array lengths not equal
        // revert if withdraw is zero
        // revert if bridging is not allowed
        // revert if amount exceeds user balance
        // revert if tokens are locked on the other chain
        // user balance set properly
        // token balance set properly
    
    // setTokenBridgeability
        // revert if called by someone other than owner
        // TokenBridgeabilityUpdated event is correct
    
    // setUserTokenLocation
        // revert if called by someone other than owner
        // UserTokenLocationUpdated event is correct
    
    
  });