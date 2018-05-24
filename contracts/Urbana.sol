pragma solidity ^0.4.23;

// import APS smartcontract

contract Urbana{

    struct user{
        address account; // unique identity
        string license_number;
        string name;
        string phone_number;
        uint256 aps_balance; //amount of APS 
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
    mapping(uint256 => reservation) public reservations;
    mapping(uint256 => rental) public rentals;
    mapping(uint256 => payment) public payments;
    
    constructor () public {

    }
    
    /* 
     * Registration of user and parking space
     * User needs to pay ether to get APS. After payment to APS smartcontract, APS balance will be stored on user account
     */

    function create_user(address _account, string _lincense_number, string _name, string _phone_number) public { 
        require(_account != 0x0);
        require(users[_account]._account == 0x0); // check duplicate account number
        users[_account] = user(_account,_license_number,_name,_phone_number); 
        // TODO : call APS contract to exchange ether into APS and store APS info of user into user.
    }

    function create_parking_space(uint256 _id, address _owner, string _addr, uint256 _zip, uint256 _block_sizes, uint256 _hourly_rates, uint256 _curr_occupancy_levels, bool _is_parking_available) public {
        require(users[_owner]._account ! = 0x0); // check owner account exists
        require(_id != 0x0);
        require(parking_spaces[_id]._id == 0x0); // check parking_space with smae id does not exist
        user storage owner = users[_owner];
        parking_spaces[_id] = parking_space(_id,_owner,_addr,_zip,_block_sizes,_hourly_rates,_curr_occupancy_levels,_is_parking_available);
    }

    /*  
     * Make a deposit of APS on user account. Charge APS on user creation or whenever user 
     */

    function _exchange_aps_with_ether(address _buyer, uint256 _ether_amount) internal payable returns (uin256 aps_amount){
        uint256 aps_amount; // TODO : return aps_amount after buying aps from APS smartcontract.
        // APS.buy.sendTransaction({from:_buyer,value:_ether_amount})
        returns aps_amount;
    }

    function charge_aps(address _buyer, uint256 _ether_amount) public payable {
        uint256 memory min_amount; // initialize minimum amount of ether
        require(users[_buyer]._buyer != 0x0); // check user exists
        require(ether_amount > min_amount);
        uint256 _aps_amount = _exchange_aps_with_ether(_buyer,_ether_amount);
        user storage user = users[_buyer];
        user.aps_balance += _aps_amount;
    }

    /*  
     * Transactions related with parking 
     */

    function create_reservation(uint256 _reservation_id, address _renter, uint256 _parking_space_id, uint256 _parking_block_number, uint256 _reservation_time, uint256 _pre_financing, uint256 _penalty, uint256 _reservation_end_time, bool _ended) public {
        require(_reservation_id != 0x0); 
        require(reservations[_reservation_id].id == 0x0); // check reservation with same id does not exists
        require(users[_renter]._renter != 0x0); // check user exists
        user storage renter = users[_renter];
        parking_space storage reserved_space = parking_spaces[_parking_space_id];
        reservations[_reservation_id] = reservation(_reservation_id,renter,reserved_place,_parking_block_number,_reservation_time,_pre_financing, _penalty, _reservation_end_time, _ended);

        // TODO : If(cancellation), _charge_cancellation_fee
        // TODO : If(no_show), _charge_penalty
    }

    function _charge_cancellation_fee() internal {} // NOTE : charge cancellation fee with pre_financing

    function _charge_penalty(uint256 _reservation_id, address _renter) internal { // NOTE : charge penalty on no-show

    }

    function create_rental(uint256 _rental_id, uint256 _reservation_id, address _renter, uint256 _parking_space_id, uint256 _parking_block_number, uint256 _rental_start_time, uint256 _rental_end_time, bool _ended) public {
        require(rentals[_rental_id].id == 0x0); // check rental with same id does not exist
        // Reservation could either exists.
        user storage renter = users[_renter];
        parking_space storage rental_space = parking_spaces[_parking_space_id];
        rentals[_rental_id] = rental(_rental_id,_reservation_id,renter,rental_space,_parking_block_number,_rental_start_time,_rental_end_time,_ended);
        // TOOD : When the car starts parking, create rental
    }

    function payment() public {  
        
        // TODO : when rental ends, payment happens
    }


}