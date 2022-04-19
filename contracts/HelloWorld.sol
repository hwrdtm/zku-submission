//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title HelloWorld
 * @dev Store & retrieve value in a variable
 */
contract HelloWorld {
    
    uint256 private number;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function storeNumber(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieveNumber() public view returns (uint256) {
        return number;
    }

}