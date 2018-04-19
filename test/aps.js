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
        console.log(balance)
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

  it('Set buy price of APS 0.02 ether and sell price 0.01', function () {
    APS.deployed().then(function (instance) {
        instance.setPrice(0.02, 0.01)
        return instance
    })
    .then(function () {
        return Promise.all([instance.buyPrice(), instance.sellPrice()])
    })
    .then(function (results) {
        assert.equal(results[0], 0.02, 'Buy price of APS is 0.02')
        assert.equal(results[1], 0.01, 'Sell price of APS is 0.01')
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

  //   it('', function () {
  //     // Get the initial ether/APS balance of accounts
  //     // Buy APS with ethers
  //     // show decrement of ether, show increment of APS
  //   })

  //   it('', function () {
  //     // transfer APS to another address
  //     // Freeze account and transfer APS to another address(error)
  //   })

//   it('', function () {
//     // transferFrom APS to another address
//   })
})
