pragma solidity ^0.4.23;

import "./StandardToken.sol";

contract IDVNToken is StandardToken {
  string public constant name = "IDVNToken"; // solium-disable-line uppercase
  string public constant symbol = "IDVNT"; // solium-disable-line uppercase
  uint8 public constant decimals = 2; // solium-disable-line uppercase

  uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

  /**
   * @dev Constructor that gives msg.sender all of existing tokens.
   */
  constructor() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
  }
}