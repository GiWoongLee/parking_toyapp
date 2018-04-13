pragma solidity ^0.4.19;

contract APS{
    string public name; // AutopaymentParkingSystem
    string public symbol; // APS
    uint256 public decimals = 18;
    uint256 public totalSupply; 
    
    mapping (address => uint) public balanceOf;
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

    // Get the total token supply
    function totalSupply() public constant returns (uint){
        return totalSupply;
    }

    // Get the account balance of another account with address tokenOwner
    function balanceOf(address tokenOwner) public constant returns (uint balance){
        return balanceOf[tokenOwner];
    }

    // Returns the amount which spender is still allowed to withdraw from tokenOwner
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining){
        return allowed[tokenOwner][spender];
    }

    // Send tokens amount of tokens to address to
    function transfer(address to, uint tokens) public returns (bool success){
        //require(to != 0x0);
        require(balanceOf[msg.sender]>= tokens); // check balanceOf msg.sender
        require(balanceOf[to] + tokens >= balanceOf[to]); // prevent overflow
        uint256 totalBalances = balanceOf[msg.sender] + balanceOf[to];
        balanceOf[msg.sender] -= tokens;
        balanceOf[to] += tokens;
        emit Transfer(msg.sender,to,tokens);
        assert(totalBalances == balanceOf[msg.sender] + balanceOf[to]);
        return true;
    }

    // Allow spender to withdraw from your account, multiple times, up to the tokens amount. 
    function approve(address spender, uint tokens) public returns (bool success){
        require(spender != 0x0);
        require(balanceOf[msg.sender]>=tokens);
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender,spender,tokens);
        return true;
    }

    // send tokens from address from to address to
    function transferFrom(address from, address to, uint tokens) public returns (bool success){
        require(balanceOf[msg.sender]>=tokens);
        require(allowed[msg.sender][from]>=tokens);
        require(balanceOf[to] + tokens >= balanceOf[to]);
        balanceOf[msg.sender] -= tokens;
        balanceOf[to] += tokens;
        allowed[msg.sender][from] -= tokens;
        emit Transfer(msg.sender,to,tokens);
        return true;
    }


    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);    
}
