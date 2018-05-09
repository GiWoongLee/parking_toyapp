pragma solidity ^0.4.23;

contract Urbana{

    struct user{
        address account; // unique identity
        string license_number;
        string name;
        string phone_number;
        // TODO : uint256 APS_balance; //amount of APS 
    }
    
    struct parking_space{
        uint256 id; // parking_space_number
        user owner;
        string addr; //address
        uint256 zip; // zip code
        uint256 block_sizes; // amounts of blocks for parking
        uint256 hourly_rates; // NOTE : rate for hour, estimated in ether
        uint256 curr_occupancy_levels; // amounts of blocks that are occupied with reservations/parkings
        bool is_parking_available; // whether parking is available
    }

    struct reservation{ 
        uint256 id; // reservation number
        user renter;
        parking_space reserved_space; // reserved parking space
        uint256 parking_block_number; // parking_block number of parking_space
        uint256 reservation_time; // estimated in UNIX time
        uint256 pre_financing; //  penalty for reservation cancellation. Estimated in ether
        uint256 penalty; // penalty for no-show. Estimated in ether
        uint256 reservation_end_time; // NOTE : When renter doesn't come until reservation_end_time, penalty would be paid to owner
        bool ended;
    }

    struct rental{
        uint256 id; // rental number
        uint256 reservation_id; // If rental is made from reservation, link it to rental.
        user renter;
        parking_space rental_space; // rental parking space
        uint256 parking_block_number; // parking_block_number of parking_space
        uint256 rental_start_time;
        uint256 rental_end_time; 
        bool ended; 
    }

    struct payment{
        rental id; // rental id
        uint256 amount; 
        uint256 paid_time; 
        bool paid;
    }

    mapping(address => user) public users;
    mapping(uint256 => parking_space) public parking_spaces;
    mapping(uint256 => mapping (uint256 => bool)) parking_block_occupied; // NOTE : (parking_space_id) => (parking_block) => (occupied or not)
    
    constructor () public {

    }
    
    /* 
     * Registration of user and parking space
     * User needs to pay ether to get APS. After payment to APS smartcontract, APS balance will be stored on user account
     */

    function createUser(address _account, string _lincense_number, string _name, string _phone_number) public { 
        require(users[_account]._account != _account); // check duplicate account number
        require(_account != 0x0);
        users[_account] = user(_account,_license_number,_name,_phone_number); 
        // TODO : call APS contract to exchange ether into APS and store APS info of user into user.
    }

    function createParkingSpace(uint256 _id, address _owner, string _addr, uint256 _zip, uint256 _block_sizes, uint256 _hourly_rates, uint256 _curr_occupancy_levels, bool _is_parking_available) public {
        require(users[_owner]._account ! = 0x0); // check owner account exists
        require(parking_spaces[_id]._id == 0x0); // check parking_space does not exist
        parking_spaces[_id] = parking_space(_id,_owner,_addr,_zip,_block_sizes,_hourly_rates,_curr_occupancy_levels,_is_parking_available);
    }

}