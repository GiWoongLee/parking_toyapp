pragma solidity ^0.4.19;

// TODO : Add ERC223 and other 
// TODO : When creating the contract, send enough Ether to it so that it can buy back all the tokens on the market otherwise your contract will be insolvent and your users won't be able to sell their tokens
contract APS{
    string public name; // AutopaymentParkingSystem
    string public symbol; // APS
    uint256 public decimals = 18;
    uint256 public totalSupply; 
    address public owner; // Urbana
    uint256 public buyPrice; // estimated in wei
    uint256 public sellPrice; // estimated in wei

    mapping (address => uint256) public balanceOf;
    mapping (address => mapping(address => uint256)) allowed;
    mapping (address => bool) public frozenAccount; // freezing balances of invalid account

    // Function that is called only once on creation
    function APS(
        string tokenName,
        string tokenSymbol,
        uint256 initialSupply,
        address centralMinter // Set owner with parameter on initialization
    ) public {
        name = tokenName;
        symbol = tokenSymbol;
        totalSupply = initialSupply * 10 ** decimals;
        balanceOf[msg.sender] = totalSupply;
        if(centralMinter!=0x0) owner = centralMinter; // Set Urbana as a owner on initialization
    }

    // TODO : Replace owner as centralMinter;
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
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
        require(!frozenAccount[_from]);
        require(!frozenAccount[_to]);
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

    // TODO : Find interface of relevant exchange to buy ethereum with cash. Ethereum would be used to buy APS.
    // added function approveAndCall to interact with etheruem exchange
    // function approveAndCall(address _spender, uint256 _value, bytes _extraData) public returns (bool success){
    //     tokenRecipient spender = tokenRecipient(_spender);
    //     if(approve(_spender,_value)){
    //         spender.receiveApproval(msg.sender,_value,this,_extraData);
    //         return true;
    //     }
    // }

    // ERC20 Standard: send tokens from address from to address to
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(allowed[_from][msg.sender]>=_value);
        allowed[_from][msg.sender] -= _value;
        _transfer(_from,_to,_value);
        emit Transfer(msg.sender,_from,_to,_value);
        return true;
    }

    function setPrices(uint256 newBuyPrice,uint256 newSellPrice) onlyOwner {
        buyPrice = newBuyPrice;
        sellPrice = newSellPrice;
    }

    function buy() payable public returns (uint256 amount) {
        amount = msg.value / buyPrice;
        require(balanceOf[this]>=amount);
        balanceOf[msg.sender] += amount;
        balanceOf[this] -= amount;
        emit Transfer(this, msg.sender, amount);
        return amount;
    }

    function sell(uint256 amount) payable public returns (uint256 revenue) {
        require(balanceOf[msg.sender]>=amount);
        balanceOf[msg.sender] -= amount;
        balanceOf[this] += amount;
        revenue = amount * sellPrice;
        msg.sender.transfer(revenue); // sends ether to the seller
        emit Transfer(msg.sender,this,amount);
        return revenue;
    }

    // Issue new tokens on circulation to control token price
    function mintToken(uint256 mintedAmount) onlyOwner{
        balanceOf[owner] += mintedAmount;
        totalSupply += mintedAmount;
        emit MintToken(mintedAmount);
    }

    // Remove tokens from circulation to control token prcie
    function burnToken(uint256 burnedAmount) onlyOwner{
        balanceOf[owner] -= burnedAmount;
        totalSupply -= burnedAmount;
        emit BurnToken(burnedAmount);
    }

    function freezeAccount(address target,bool freeze) onlyOwner{
        frozenAccount[target] = freeze;
        emit FrozenAccounts(target,freeze);
    }


    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);    
    // NOTE: Suggested ERC20 API changes to address attack, overloading events
    event Transfer(address indexed _spender, address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _oldValue, uint256 value);
    event MintToken(uint256 amount);
    event BurnToken(uint256 amount);
    event FrozenAccounts(address target, bool frozen);
}
