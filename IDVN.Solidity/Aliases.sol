pragma solidity ^0.4.24;

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

interface Token {
  /// @return total amount of tokens
  function totalSupply() external view returns (uint256 supply);

  /// @param _owner The address from which the balance will be retrieved
  /// @return The balance
  function balanceOf(address _owner) external view returns (uint256 balance);

  /// @notice send `_value` token to `_to` from `msg.sender`
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transfer(address _to, uint256 _value) external returns (bool success);

  /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
  /// @param _from The address of the sender
  /// @param _to The address of the recipient
  /// @param _value The amount of token to be transferred
  /// @return Whether the transfer was successful or not
  function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);

  /// @notice `msg.sender` approves `_addr` to spend `_value` tokens
  /// @param _spender The address of the account able to transfer  tokens
  /// @param _value The amount of wei to be approved for transferthe
  /// @return Whether the approval was successful or not
  function approve(address _spender, uint256 _value) external returns (bool success);

  /// @param _owner The address of the account owning tokens
  /// @param _spender The address of the account able to transfer the tokens
  /// @return Amount of remaining tokens allowed to spent
  function allowance(address _owner, address _spender) external view returns (uint256 remaining);

  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}
/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  constructor() public {
    owner = msg.sender;
  }

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param _newOwner The address to transfer ownership to.
   */
  function transferOwnership(address _newOwner) public onlyOwner {
    require(_newOwner != address(0));
    owner = _newOwner;
  }
}

contract AliasesV1 is Ownable {
    using SafeMath for uint;
    
    struct Alias {
        uint claimedOn;
        address owner;
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
        
        _claimAlias(_alias);
    }
    
    function claimAliasWithToken(string _alias) public {
        require(!_isEmptyString(_alias), 'Invalid alias.');
        require(!(isClaimedAlias(_alias)), 'Alias is already claimed.');
        
        if (claimTokenFeeAmount > 0) {
            //ensure approve() method or this contract will not be able to do the transfer on your behalf.
            require(Token(claimTokenAddress).transferFrom(msg.sender, wallet, claimTokenFeeAmount));
        }
        
        _claimAlias(_alias);
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
    
    function _claimAlias(string _alias) private {
        aliasesMap[_alias].claimedOn = now;
        aliasesMap[_alias].owner = msg.sender;
        
        addrAliasesMap[msg.sender].push(_alias);
        
        claimedAliasesCount = claimedAliasesCount.add(1);
        emit ClaimedAliasesCountChanged(claimedAliasesCount);
    }
}
