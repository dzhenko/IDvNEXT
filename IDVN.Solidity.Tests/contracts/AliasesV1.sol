pragma solidity ^0.4.24;

contract AliasesV1 {
    using SafeMath for uint;
    
    struct Alias {
        uint claimedOn;
        address owner;
    }
    
    mapping(string => Alias) aliasesMap;
    mapping(address => string[]) addrAliasesMap;

    uint public claimedAliasesCount;

    function isClaimedAlias(string _alias) public view returns (bool isClaimed) {
        return aliasesMap[_alias].owner != address(0x0);
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
    
    function claimAlias(string _alias) public {
        require(!isEmptyString(_alias), 'Invalid alias.');
        require(!(isClaimedAlias(_alias)), 'Alias is already claimed.');
        
        aliasesMap[_alias].claimedOn = now;
        aliasesMap[_alias].owner = msg.sender;
        
        addrAliasesMap[msg.sender].push(_alias);
        
        claimedAliasesCount = claimedAliasesCount.add(1);
    }
    
    function releaseAlias(string _alias) public {
        require(!isEmptyString(_alias), 'Invalid alias.');
        require(isClaimedAlias(_alias), 'Alias not claimed yet.');
        require(aliasesMap[_alias].owner == msg.sender, 'Alias not yours.');
        
        delete aliasesMap[_alias];
        
        claimedAliasesCount = claimedAliasesCount.sub(1);
    }
    
    function isEmptyString(string _val) private pure returns (bool isEmpty) {
        bytes memory stringBytes = bytes(_val);
        return stringBytes.length == 0;
    }
}

/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(uint256 a, uint256 b) internal pure returns (uint256 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(uint256 a, uint256 b) internal pure returns (uint256 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}