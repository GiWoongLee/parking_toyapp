pragma solidity ^0.4.19;

contract APS{
    string public name; // AutopaymentParkingSystem
    string public symbol; // APS
    uint256 public decimals = 18;
    uint256 public totalSupply; 
    address public owner; // Urbana

    mapping (address => uint) public balanceOf;
    

    // Function that is called only once on creation
    function APS(
        string tokenName,
        string tokenSymbol,
        uint256 initialSupply
    ) public {
        name = tokenName;
        symbol = tokenSymbol;
        totalSupply = initialSupply * 10 ** decimals;
        owner = msg.sender; // Urbana
        balanceOf[owner] = totalSupply;
    }
}