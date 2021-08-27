//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IWeth9.sol";

contract Bridge is Ownable {
    
    using SafeERC20 for IERC20Metadata;

    struct TokenDetail {
        uint256 balance;
        bool canBridge; 
    }
    
    // false means its on the other chain
    struct CrossChainBalance {
        uint256 balance;
        bool onThisChain; 
    }
    
    mapping(address => TokenDetail) private _tokens;
    // token --> wallet
    mapping(address => mapping(address => CrossChainBalance)) private _balances;

    address public wethAddress = address(0); // hardcoded for now 

    event Deposit(address indexed user, address[] tokens, uint256[] tokenAmounts, uint256 ethAmount);
    event Withdraw(address indexed user, address[] tokens, uint256[] tokenAmounts, uint256 ethAmount);
    event TokenBridgeabilityUpdated(address asset, bool state);
    event UserTokenLocationUpdated(address user, address asset, bool state);

    function deposit(
        address[] memory tokens, 
        uint256[] memory amounts
    ) external payable {
        if(msg.value > 0) {
            // Convert ETH to WETH
            IWeth9 weth = IWeth9(wethAddress);
            weth.deposit{value: msg.value}();
        }
        
        depositHandler(msg.sender, tokens, amounts, msg.value);
        emit Deposit(msg.sender, tokens, amounts, msg.value);
    }

    function depositHandler(
        address depositor, 
        address[] memory tokens, 
        uint256[] memory amounts, 
        uint256 ethAmount
    ) internal {
        for(uint256 tokenId; tokenId < tokens.length; tokenId++) {
            // Token must be accepting deposits
            (uint tokenBalance, bool tokenState) = tokenDetails(tokens[tokenId]);
            (uint256 userBalance, ) = userTokenBalance(depositor, tokens[tokenId]);
            
            require(tokenState,
                "DepositHandler: This token is not able to be bridged");

            require(amounts[tokenId] > 0, 
                "DepositHandler: Deposit amount must be greater than zero");

            IERC20Metadata erc20 = IERC20Metadata(tokens[tokenId]);

            // Get the balance before the transfer
            uint256 beforeBalance = erc20.balanceOf(address(this));

            // Transfer the tokens from the depositor to the Kernel
            erc20.safeTransferFrom(depositor, address(this), amounts[tokenId]);

            // Get the balance after the transfer
            uint256 afterBalance = erc20.balanceOf(address(this));
            uint256 actualAmount = afterBalance - beforeBalance;

            // Update balances
            setTokenBalance(tokens[tokenId], tokenBalance + actualAmount);
            setUserTokenBalance(tokens[tokenId], depositor, userBalance + actualAmount);
        }

        if(ethAmount > 0) {
            // Update WETH balances
            (uint tokenBalance, ) = tokenDetails(wethAddress);
            (uint256 userBalance, ) = userTokenBalance(depositor, wethAddress);
            
            setTokenBalance(wethAddress, tokenBalance + ethAmount);
            setUserTokenBalance(wethAddress, depositor, userBalance + ethAmount);
        }
    }
    
    function withdraw(
        address[] memory tokens, 
        uint256[] memory amounts, 
        bool withdrawWethAsEth
    ) external {
        uint256 ethWithdrawn = withdrawHandler(msg.sender, tokens, amounts, withdrawWethAsEth);

        if (ethWithdrawn > 0) {
            IWeth9(wethAddress).withdraw(ethWithdrawn);

            payable(msg.sender).transfer(ethWithdrawn);
        }

        emit Withdraw(msg.sender, tokens, amounts, ethWithdrawn);
    }

    function withdrawHandler(
        address recipient, 
        address[] memory tokens, 
        uint256[] memory amounts, 
        bool withdrawWethAsEth) 
    private returns (
        uint256 ethWithdrawn
    ) {
        require(tokens.length == amounts.length, 
            "WithdrawHandler: Tokens array length does not match amounts array length");
        
        for(uint256 tokenId; tokenId < tokens.length; tokenId++) {
            require(amounts[tokenId] > 0, 
                "WithdrawHandler: Withdraw amount must be greater than zero");
            (uint tokenBalance, bool tokenState) = tokenDetails(tokens[tokenId]);
            require(tokenState,
                "WithdrawHandler: This token is not accepting withdrawals");

            (uint256 userBalance, bool userState) = userTokenBalance(recipient, tokens[tokenId]);
            require(amounts[tokenId] <= userBalance, 
                "WithdrawHandler: Withdraw amount exceeds user balance");
            require(userState, 
                "WithdrawHandler: Tokens are locked on the other chain currently");

            // Update balances
            setTokenBalance(tokens[tokenId], tokenBalance - amounts[tokenId]);
            setUserTokenBalance(tokens[tokenId], recipient, userBalance - amounts[tokenId]);

            if(tokens[tokenId] == wethAddress && withdrawWethAsEth) {
                ethWithdrawn = amounts[tokenId];
            } else {
                // Send the tokens back to specified recipient
                IERC20Metadata(tokens[tokenId])
                    .safeTransferFrom(address(this), recipient, amounts[tokenId]);
            }
        }
    }

    
    function setTokenBridgeability(address asset) external onlyOwner {
        (, bool currState) = tokenDetails(asset);
        _tokens[asset].canBridge = !currState;
        emit TokenBridgeabilityUpdated(asset, _tokens[asset].canBridge);
    }

    function setTokenBalance(address asset, uint256 amount) internal {
        _tokens[asset].balance = amount;
    }
    
    function setUserTokenBalance(address asset, address account, uint256 amount) internal {
        _balances[asset][account].balance = amount;
    }
    
    function setUserTokenLocation(address asset, address account) external onlyOwner {
        (, bool currState) = userTokenBalance(asset, account);
        _balances[asset][account].onThisChain = !currState;
        emit UserTokenLocationUpdated(account, asset, _balances[asset][account].onThisChain);
    }
    
    function tokenDetails(address asset) public view returns (uint256, bool) {
        return (_tokens[asset].balance, _tokens[asset].canBridge);
    }

    function userTokenBalance(address asset, address account) public view returns (uint256, bool) {
        return (_balances[asset][account].balance, _balances[asset][account].onThisChain);
    }

}