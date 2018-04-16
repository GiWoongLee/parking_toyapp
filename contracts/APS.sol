pragma solidity ^0.4.19;

contract APS{
    string public name; // AutopaymentParkingSystem
    string public symbol; // APS
    uint256 public decimals = 18;
    uint256 public totalSupply; 
    
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping(address => uint256)) allowed;

    // Function that is called only once on creation
    function APS(
        string tokenName,
        string tokenSymbol,
        uint256 initialSupply
    ) public {
        name = tokenName;
        symbol = tokenSymbol;
        totalSupply = initialSupply * 10 ** decimals;
        balanceOf[msg.sender] = totalSupply;
    }

    // ERC20 Standard: Get the total token supply
    function totalSupply() public constant returns (uint256){
        return totalSupply;
    }

    // ERC20 Standard: Get the account balance of another account with address tokenOwner
    function balanceOf(address _owner) public constant returns (uint256 balance){
        return balanceOf[_owner];
    }

    // ERC20 Standard: Returns the amount which spender is still allowed to withdraw from tokenOwner
    function allowance(address _owner, address _spender) public constant returns (uint remaining){
        return allowed[_owner][_spender];
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != 0x0);
        require(balanceOf[_from]>= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        uint256 totalBalances = balanceOf[_from] + balanceOf[_to];
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from,_to,_value);
        assert(totalBalances == balanceOf[_from] + balanceOf[_to]);
    }

    // ERC20 Standard: Send tokens amount of tokens to address to
    function transfer(address _to, uint256 _value) public returns (bool success){
        _transfer(msg.sender,_to,_value);
        return true;
    }

    // ERC20 Standard: Allow spender to withdraw from your account, multiple times, up to the tokens amount. 
    function approve(address _spender, uint256 _value) public returns (bool success){
        require(_spender != 0x0);
        require(balanceOf[msg.sender]>=_value);
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_value);
        return true;
    }

    // current allowance for _spender is equalt to _currentValue, then overwrite it with _value and return true
    // NOTE: Suggested ERC20 API changes to address attack
    function approve(address _spender, uint256 _currentValue, uint256 _value) public returns (bool success){
        require(_spender != 0x0);
        require(balanceOf[msg.sender]>=_value);
        require(allowed[msg.sender][_spender]== _currentValue);
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender,_currentValue,_value);
        return true;
    }

    // ERC20 Standard: send tokens from address from to address to
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(allowed[_from][msg.sender]>=_value);
        allowed[_from][msg.sender] -= _value;
        _transfer(_from,_to,_value);
        emit Transfer(msg.sender,_from,_to,_value);
        return true;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);    
    // NOTE: Suggested ERC20 API changes to address attack, overloading events
    event Transfer(address indexed _spender, address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _oldValue, uint256 value);
    
}

