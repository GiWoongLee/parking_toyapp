pragma solidity ^0.4.23;

contract Urbana{

    struct user{
        string license_number;
        address account; // unique identity
        string name;
        string phone_number;
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
    mapping(uint256 => mapping (uint256 => bool)) parking_block_occupied; // NOTE : (parking_space_id) => (parking_block) => (occupied or not)
    
    constructor () public {

    }
    

}