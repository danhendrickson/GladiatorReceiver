// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/*
                .:=::.                 
            -+*#%%%@+-==+++-.           
        =*%%@@%%%@@= :*%%-.-+=.        
      .+@@@@@@@%@+#@@%*+  :@+:.      
    :#@@@@*@@%@@@@@#@@@.=@ .@#-==:     
    =#@@@@@%*@@@@@@@#@@+.=* %%@@@%#+    
    +#*%@@@##@@@@@@#@@=-#.#%%@@=       
    .%#@=%@@@+@*@@@@#@%@+@*##@#  :%     
    %@%+@=%@@*++@@@#@%:++@*%-@=*@@     
    %%@@@+#%@@=%@@@#@%*+@+#*-#%@*%     
    .@%@%%@@%+%%:%%@##+:%*=%@@%%@*@.    
    -@@@.  .:-++=%@%*--++==:.  .@       
    -@%@:         **+*.        .%-+:    
    =#@#+=-:      ++      :--+*-+.     
    =@%@*#%@.            .@%#*#+ .     
    =@@@*+#+.             @%*#*  :     
    #@%%%*++-            =*+#= :-*     
    +@#@#=##=*+          #*+#*:--.@*    
    +@*@*-=# +-        -+.#=-*+-@*     
    :%#= .@.:+        +-:@. =#%-      
        -#*-@- #        #==@:*#-        
        .=#%*@        @*%*=.          
            :-        --              

              Brokenreality
         Gladiator Funds Receiver
*/

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

// Error Library
error TokenNotAllowed();
error EthTransferFailed();
error ZeroValue();

/// @title Gladitor Funds Receviable Contract
/// @dev This contract is strictly used to receive developer funds for the Gladitor project
contract GladiatorReceiver is Ownable, ReentrancyGuard {
    // Mental Health Foundation (part of my story)
    address payable public mhf;
    // Animal Sanctuary
    address payable public asanc;
    // CROC (Citizens Reunited to Overcome Cancer)
    address payable public croc;
    // developer fund
    address payable public devFund;
    // Allowed ERC20 token list
    mapping(address => bool) public allowedTokens;
    // Event emitters
    event Deposit(address account, address token, uint256 amount);
    // Set default developer fund address
    constructor(address _mhf, address _asanc, address _croc, address _devFund) {
        mhf = payable(_mhf);
        asanc = payable(_asanc);
        croc = payable(_croc);
        devFund = payable(_devFund);
    }

    receive() external payable {}

    /**
     ** @dev The allowAddress function updates the list of accepted
     ** tokens managed by the contract.
     ** @param _token The ERC20 token address to allow
     */
    function allowAddress(address _token) public onlyOwner {
        allowedTokens[_token] = true;
    }

    /**
     ** @dev The deposit function accepts a token address merely for emission
     ** purposes. The token address will be checked against the allow list. 
     ** Additionally the token allowance will also be checked.
     ** @param _token The ERC20 token address to be deposited
     ** @param _amount The ERC20 amount to be deposited
     */
    function deposit(address _token, uint _amount) public payable nonReentrant {
        if (_amount == 0) revert ZeroValue();
        if (!allowedTokens[_token]) revert TokenNotAllowed();
        bool success = IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        if (!success) revert EthTransferFailed();
        emit Deposit(msg.sender, _token, _amount);
    }
    
    /**
     ** @dev The withdraw function checks the current contract balance of the passed ERC20 token
     ** and performs a withdraw using the tried and true call method. 
     */
    function withdraw(address _token) external onlyOwner nonReentrant {
        uint256 currentBalance = IERC20(_token).balanceOf(address(this));
        if (currentBalance == 0) revert ZeroValue();

        bool success = IERC20(_token).transfer(devFund, currentBalance);
        if (!success) revert EthTransferFailed();
    }

    /**
     ** @dev The withdraw function checks the current contract balance of ETH
     ** and performs a withdraw using the tried and true call method. 
     */
    function withdrawEth() external onlyOwner nonReentrant {
        uint256 currentBalance = address(this).balance;
        if (currentBalance == 0) revert ZeroValue();
        uint256 amountToTransfer = (currentBalance * 25e19) / 1e21;

        (bool success1, ) = payable(mhf).call{value: amountToTransfer}("");
        if (!success1) revert EthTransferFailed();

        (bool success2, ) = payable(asanc).call{value: amountToTransfer}("");
        if (!success2) revert EthTransferFailed();

        (bool success3, ) = payable(croc).call{value: amountToTransfer}("");
        if (!success3) revert EthTransferFailed();

        (bool success4, ) = payable(devFund).call{value: amountToTransfer}("");
        if (!success4) revert EthTransferFailed();
    }

    function balanceOfToken(address _token) public view returns (uint256) {
        return IERC20(_token).balanceOf(address(this));
    }

    /**
     ** @dev The setMhfAccount function updates the address in which
     ** the funds can be withdrawn to Mental Health Foundation.
     */
    function setMhfAccount(address _mhf) external onlyOwner {
        mhf = payable(_mhf);
    }

    /**
     ** @dev The setAsancAccount function updates the address in which
     ** the funds can be withdrawn to the Animal Sanctuary.
     */
    function setAsancAccount(address _asanc) external onlyOwner {
        asanc = payable(_asanc);
    }

    /**
     ** @dev The setCrocAccount function updates the address in which
     ** the funds can be withdrawn to CROC.
     */
    function setCrocAccount(address _croc) external onlyOwner {
        croc = payable(_croc);
    }

    /**
     ** @dev The setDeveloperFund function updates the address in which
     ** the funds can be withdrawn to the developer fund.
     */
    function setDevAccount(address _devFund) external onlyOwner {
        devFund = payable(_devFund);
    }

}
