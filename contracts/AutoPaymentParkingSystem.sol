pragma solidity ^0.4.19;

contract AutoPaymentParkingSystem{
    address public owner; // Urbana
    mapping (address => uint) public balances;
    enum State {Reserved, Parked, Finished} // State of parking

    // Function that is called only once on creation
    function AutoPaymentParkingSystem() public {
        owner = msg.sender; // Urbana
    }

    function buyAPS() public returns (bool suceess) {
    }

    function sellAPS() public returns (bool success) {

    }

    // lease(request function) <=> rent(response function)
    function lease() public returns (bool success) {

    }

    function rent() public returns (bool success) {

    }

    function transfer() public returns (bool success) {

    }

    // END renting space and transfer APS from a leaser to a renter
    function payment() public returns (bool success){

    }

    // selfdestruct APS and pay back to owner with ether
    function retrieve() public returns (bool success) {

    }

    // adjusting total amount of APS
    function mint() public returns (bool success){

    }

    // adjusting total amount of APS
    function burn() public returns (bool success){

    }

    // event 
    // event
    // event
}