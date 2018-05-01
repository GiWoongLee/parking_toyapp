var APS = artifacts.require('./APS')


contract('APS', function (accounts) {
  it('Total supply of APS is 10000', function () {
    APS.deployed().then(function (instance) {
        return instance.totalSupply()
    })
    .then(function (totalSupply) {
        totalSupply = web3.fromWei(totalSupply.toNumber(), 'ether')
        assert.equal(totalSupply, 10000, 'Total supply of APS is 10000')
    })
  })

  it('APS Balance of centralMinter is 10000 while others have 0', function () {
    APS.deployed().then(function (instance) {
      // TODO : check balances of all accounts
      // Declare functions lambda(x:lists,x => instance.balanceOf(x))
      // map or forEach accounts 
      // return Promise.all()
        return instance.balanceOf(instance.centralMinter())
    // assert.equal()
    })
    .then(function (balance) {
        balance = web3.fromWei(balance.toNumber(), 'ether')
        assert.equal(balance, 10000, 'Balance of central Minter is not 0!')
    })
  })

  it('Allowance from account0 to account1 is 0', function () {
    APS.deployed().then(function (instance) {
        return instance.allowance(accounts[0], accounts[1])
    })
    .then(function (allowance) {
        allowance = web3.fromWei(allowance.toNumber(), 'ether')
        assert.equal(allowance, 0, 'Allowance from account0 to account1 is not 0!')
    })
  })

  it('Set buy price of APS 1 ether and sell price 1', function () {
    APS.deployed().then(function (instance) {
        instance.setPrice(10**18, 10**18)
        return instance
    })
    .then(function () {
        return Promise.all([instance.buyPrice(), instance.sellPrice()])
    })
    .then(function (results) {
        assert.equal(results[0], 10**18, 'Buy price of APS is 1')
        assert.equal(results[1], 10**18, 'Sell price of APS is 1')
    })
  })

  it('If 10000 token is minted, total would be 20000', function () {
    APS.deployed().then(function (instance) {
        instance.mintToken(10000*10**18)
        return instance
    })
    .then(function (instance) {
        return instance.totalSupply()
    })
    .then(function (totalSupply) {
        totalSupply = web3.fromWei(totalSupply.toNumber(), 'ether')
        assert.equal(totalSupply, 20000, 'Total supply of APS is 20000')
    })
  })

  it('If 10000 token is burned, total would be 10000', function () {
    APS.deployed().then(function (instance) {
        instance.burnToken(10000 * 10 ** 18)
        return instance
    })
    .then(function (instance) {
        return instance.totalSupply()
    })
    .then(function (totalSupply) {
        totalSupply = web3.fromWei(totalSupply.toNumber(), 'ether')
        assert.equal(totalSupply, 10000, 'Total supply of APS is 10000')
    })
  })

  it('Initial APS balance of default account is 0',function(){
    APS.deployed().then(function(instance){
        instance.balanceOf(accounts[0]); // print APS balance of User A
    })
    .then(function(amount){
        assert.equal(amount,0,"Initial APS balance of default account A is not 0!")
    })
  })

  it('Pay 1 ether to buy 1 token from account[1] to centralMinter',function(){
    var checkBalance = function(instance){
        return new Promise(async function(resolve,reject){
            var etherBalance = web3.fromWei(web3.eth.getBalance(accounts[1]).toNumber(),'ether')
            var APSBalance;
            await instance.balanceOf(accounts[1]).then(function(balance){
                APSBalance = web3.fromWei(balance.toNumber(),'ether');
            })
            resolve([etherBalance,APSBalance])
        })
    }

    APS.deployed().then(function(instance){
        checkBalance(instance) // check ether balance before payment
        .then(function(balances){
            return instance.buy.sendTransaction({from:accounts[1],value:10**18}) // NOTE : 1 ether = 1 APS
        })
        .then(function(result){
            return checkBalance(instance) // check ether balance after payment
        })
        .then(function(balances){
            assert.equal(balances[1],1,"APS balance of account[1] is not 1!")
            return web3.fromWei(web3.eth.getBalance(instance.address).toNumber(),'ether')
        })
        .then(function(etherBalance){
            assert.equal(etherBalance,1,"Ether balance of centralMinter is not 1!")
        })
        .catch(function(error){
            console.log(error)
        })
    })
    
  })




  //   it('', function () {
  //     // transfer APS to another address
  //     // Freeze account and transfer APS to another address(error)
  //   })

//   it('', function () {
//     // transferFrom APS to another address
//   })
})
