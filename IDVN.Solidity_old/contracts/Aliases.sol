pragma solidity ^0.4.23;

import { SafeMath } from './SafeMath.sol';
import { Ownable } from './Ownable.sol';
import { Token } from './Token.sol';

contract AliasesV1 is Ownable {
    using SafeMath for uint;
    
    struct Alias {
        uint claimedOn;
        address owner;
        uint fee;
        bool claimedWithEth;
    }
    
    // Address where funds are collected
    address public wallet;

    // Address of token collected collected
    address public claimTokenAddress;
    
    // Amount of claim fee in tokens
    uint public claimTokenFeeAmount;
    
    // Amount of claim fee in eth
    uint public claimEthFeeAmount;
    
    // Total amount of claimed aliases
    uint public claimedAliasesCount;
    
    /**
    * Event for claimed aliases count change
    * @param claimedAliasesCount the new count of total claimed aliases
    */
    event ClaimedAliasesCountChanged(uint claimedAliasesCount);
    
    mapping(string => Alias) private aliasesMap;
    mapping(address => string[]) private addrAliasesMap;
    
    constructor(address _wallet, address _claimTokenAddress, uint _claimTokenFeeAmount, uint _claimEthFeeAmount) public {
        require(_wallet != address(0));
        require(_claimTokenAddress != address(0));
        require(_claimTokenFeeAmount >= 0);
        require(_claimEthFeeAmount >= 0);
        
        wallet = _wallet;
        claimTokenAddress = _claimTokenAddress;
        claimTokenFeeAmount = _claimTokenFeeAmount;
        claimEthFeeAmount = _claimEthFeeAmount;
    }
    
    function transferWallet(address _newWallet) public onlyOwner {
        require(_newWallet != address(0));
        wallet = _newWallet;
    }
    
    function changeClaimTokenFeeAmount(uint _newClaimTokenFeeAmount) public onlyOwner {
        require(_newClaimTokenFeeAmount >= 0);
        claimTokenFeeAmount = _newClaimTokenFeeAmount;
    }
    
    function changeClaimEthFeeAmount(uint _newClaimEthFeeAmount) public onlyOwner {
        require(_newClaimEthFeeAmount >= 0);
        claimEthFeeAmount = _newClaimEthFeeAmount;
    }

    function isClaimedAlias(string _alias) public view returns (bool isClaimed) {
        return aliasesMap[_alias].owner != address(0);
    }
    
    function aliasToAddress(string _alias) public view returns (address addr) {
        return aliasesMap[_alias].owner;
    }
    
    function aliasesCount() public view returns (uint count) {
        return addrAliasesMap[msg.sender].length;
    }
    
    function aliasAtIndex(uint _index) public view returns (string alias) {
        require(addrAliasesMap[msg.sender].length > _index, 'Invalid index.');
        
        string memory savedAlias = addrAliasesMap[msg.sender][_index];
        if (aliasesMap[savedAlias].owner == msg.sender){
            return savedAlias;
        }
        
        return '';
    }
    
    function claimAliasWithEth(string _alias) public payable {
        require(!_isEmptyString(_alias), 'Invalid alias.');
        require(!(isClaimedAlias(_alias)), 'Alias is already claimed.');
        
        if (claimEthFeeAmount > 0) {
            require(msg.value >= claimEthFeeAmount);
            wallet.transfer(claimEthFeeAmount);
            msg.sender.transfer(msg.value.sub(claimEthFeeAmount));
        }
        
        _claimAlias(_alias, true);
    }
    
    function claimAliasWithToken(string _alias) public {
        require(!_isEmptyString(_alias), 'Invalid alias.');
        require(!(isClaimedAlias(_alias)), 'Alias is already claimed.');
        
        if (claimTokenFeeAmount > 0) {
            //ensure approve() method or this contract will not be able to do the transfer on your behalf.
            require(Token(claimTokenAddress).transferFrom(msg.sender, wallet, claimTokenFeeAmount));
        }
        
        _claimAlias(_alias, false);
    }
    
    function releaseAlias(string _alias) public {
        require(!_isEmptyString(_alias), 'Invalid alias.');
        require(isClaimedAlias(_alias), 'Alias not claimed yet.');
        require(aliasesMap[_alias].owner == msg.sender, 'Alias not yours.');
        
        delete aliasesMap[_alias];
        
        claimedAliasesCount = claimedAliasesCount.sub(1);
        emit ClaimedAliasesCountChanged(claimedAliasesCount);
    }
    
    function _isEmptyString(string _val) private pure returns (bool isEmpty) {
        bytes memory stringBytes = bytes(_val);
        return stringBytes.length == 0;
    }
    
    function _claimAlias(string _alias, bool _claimWithEth) private {
        aliasesMap[_alias].claimedOn = now;
        aliasesMap[_alias].owner = msg.sender;
        
        if (_claimWithEth) {
            aliasesMap[_alias].claimedWithEth = true;
            aliasesMap[_alias].fee = claimEthFeeAmount;
        }
        else{
            aliasesMap[_alias].fee = claimTokenFeeAmount;
        }
        
        addrAliasesMap[msg.sender].push(_alias);
        
        claimedAliasesCount = claimedAliasesCount.add(1);
        emit ClaimedAliasesCountChanged(claimedAliasesCount);
    }
}
