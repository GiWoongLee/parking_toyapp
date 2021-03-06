var APS = artifacts.require('./APS')

contract('APS', function (accounts) {
    var APSContract;

    APS.deployed().then(function(instance){
        APSContract = instance; // contract instance
    })

    // var toEther = amount => parseInt(amount)
    var toEther = amount => parseInt(web3.fromWei(amount,'ether')) // wei -> ether(string -> int)

    /*
     * Test for Initialization of contract in ganache
     * Check ether balance of accounts, including contract.
     * Check APS balance of accounts, including contract.
     */


    it('Total supply of APS is 10000', async function () {
        totalSupply = await APSContract.totalSupply() 
        totalSupply = toEther(totalSupply.toNumber()) // bigNum -> number(wei) -> ether
        assert.equal(totalSupply,10000,'Total supply of APS is 10000')
    })

    it('Initial APS balance of centralMinter is 10000 while others have 0', async function(){
        cmBalance = await APSContract.balanceOf(await APSContract.centralMinter())
        cmBalance = toEther(cmBalance.toNumber()) // big number -> number(wei) -> ether
        assert.equal(cmBalance,10000,"Balance of Central Minter is not 0!")

        var amount = await APSContract.balanceOf(accounts[0]) // default account as accounts[0] in ganache
        amount = toEther(amount.toNumber())
        assert.equal(amount,10000,'Initial APS balance of default account, accounts[0] is not 10000!') 

        var accBalances = accounts.map(async account => {return await APSContract.balanceOf(account)}) // account balances
        var balances; // balance except centralMinter(=accounts[0])
        await Promise.all(accBalances)
            .then((balances)=> balances.map(balance => toEther(balance.toNumber())) 
                .filter((balance,index) => (index!=0))
                .reduce((sum,balance) => sum + balance)
            )
            .then((amount) => {balances = amount})
            .catch((error) => {console.log(error)})
        
        assert.equal(balances,0,"Total balances of other accounts is not 0!")
    })

    it('Ether Balance of contract is 0', async function(){
        var balance = await web3.eth.getBalance(APSContract.address) // return type : big number
        balance = toEther(balance.toNumber())
        assert.equal(balance, 0, 'Ether Balance of contract is not 0!')
    })

     /*
     * Test for controlling APS in cirulation
     */


    it('If 10000 token is minted, total would be 20000',async function(){
        const decimals = 18
        const unit = 10 ** decimals // wei -> ether
        const mintAmount = 10000
        await APSContract.mintToken(mintAmount*unit)
        var totalSupply = await APSContract.totalSupply()
        totalSupply = toEther(totalSupply.toNumber())
        assert.equal(totalSupply,20000,'Total supploy of APS is not 20000!')
    })

    it('If 10000 token is burned, total would be 10000',async function(){
        const decimals = 18
        const unit = 10 ** decimals // wei -> ether
        const burnAmount = 10000
        await APSContract.burnToken(burnAmount*unit)
        var totalSupply = await APSContract.totalSupply()
        totalSupply = toEther(totalSupply.toNumber())
        assert.equal(totalSupply,10000,'Total supploy of APS is not 10000!')    
    })

    /*
     * Test for setting Buy/Sell Price of Ether
     * Test for buying APS from Contract
     * Test for selling APS to Contract
     */

    it('Set buy price of APS 0.01 ether and sell price 0.01',async function(){
        const weight = 1 // 1 ether = 100 APS, 10 ether = 1 APS
        const divisor = 100 
        const buyPrice = sellPrice = weight // wei -> ether
        await APSContract.setPrices(buyPrice, sellPrice,divisor) // 1 ether = 100 APS
        APSBuyPrice = await APSContract.buyPrice()
        APSSellPrice = await APSContract.sellPrice()
        assert.equal(APSBuyPrice,buyPrice,"Buy price of APS is not 0.01!")
        assert.equal(APSSellPrice,sellPrice,"Sell price of APS is not 0.01!")
    })

    it('Seller and buyer exchanges 2 ether and 200 APS',async function(){
        var checkBalances = async function(account){ // check APS, Ether balances
            var etherBalance = await web3.eth.getBalance(account)
            etherBalance = toEther(etherBalance.toNumber())
            var APSBalance = await APSContract.balanceOf(account)
            APSBalance = toEther(APSBalance.toNumber())
            return [etherBalance,APSBalance]
        }  

        const buyer = accounts[1]
        const seller = APSContract.address
        const decimals = 18
        const unit = 10 ** decimals
        const amount = 2
        
        sellerBalanceBef = await checkBalances(seller) // check balance before payment
        buyerBalanceBef = await checkBalances(buyer) // check balance before payment
        await APSContract.buy.sendTransaction({from:buyer,value:amount*unit}) // pay 1 ether to buy 1 APS
        sellerBalanceAft = await checkBalances(seller) // check balance after payment
        buyerBalanceAft = await checkBalances(buyer) // check balance after payment
        
        sellerEtherBalanceBef = sellerBalanceBef[0]
        sellerEtherBalanceAft = sellerBalanceAft[0]
        buyerAPSBalanceBef = buyerBalanceBef[1]
        buyerAPSBalanceAft = buyerBalanceAft[1]

        assert.equal(sellerEtherBalanceAft,sellerEtherBalanceBef+2,"Seller didn't get 1 ether selling 1 APS!")
        assert.equal(buyerAPSBalanceAft,buyerAPSBalanceBef+200,"Buyer didn't get 100 APS paying 1 ether!")
    })

    /*
     * Test for transferring from one account to the other account
     * Test for approving third party to pay APS and actual transferring from third party to an account
     * 
     */

    it('accounts[1] transfer 10 APS to accounts[2]',async function(){
        var sender = accounts[1]
        var receiver = accounts[2]
        var amount = 10**19 // APS
    
        var senderBalanceBef = await APSContract.balanceOf(sender)
        var receiverBalanceBef = await APSContract.balanceOf(receiver)
        await APSContract.transfer.sendTransaction(receiver,amount,{from:sender})
        var senderBalanceAft = await APSContract.balanceOf(sender)
        var receiverBalanceAft = await APSContract.balanceOf(receiver)
        
        senderBalanceBef = toEther(senderBalanceBef.toNumber(),'ether')
        senderBalanceAft = toEther(senderBalanceAft.toNumber(),'ether')
        receiverBalanceBef = toEther(receiverBalanceBef.toNumber(),'ether')        
        receiverBalanceAft = toEther(receiverBalanceAft.toNumber(),'ether')
        
        assert.equal(senderBalanceAft,senderBalanceBef-10,"Accounts[1] didn't send 10 APS!")
        assert.equal(receiverBalanceAft,receiverBalanceBef + 10,"Accounts[2] didn't receive 10 APS!")
    })



    it('accounts[2] transfer 10 APS to accounts[3] on behalf of accounts[1]',async function(){
        var sender = accounts[1]
        var spender = accounts[2]
        var receiver = accounts[3]
        var amount = 10 ** 19

        await APSContract.approve.sendTransaction(spender,amount,{from:sender})
        var allowedAmount = await APSContract.allowance(sender,spender)
        assert.equal(allowedAmount,10**19,'Approval from accounts[0] to accounts[1] failed!')

        var senderBalanceBef = await APSContract.balanceOf(sender)
        var receiverBalanceBef = await APSContract.balanceOf(receiver)
        await APSContract.transferFrom.sendTransaction(sender,receiver,amount,{from:spender})
        var senderBalanceAft = await APSContract.balanceOf(sender)
        var receiverBalanceAft = await APSContract.balanceOf(receiver)
    
        senderBalanceBef = toEther(senderBalanceBef.toNumber(),'ether')
        senderBalanceAft = toEther(senderBalanceAft.toNumber(),'ether')
        receiverBalanceBef = toEther(receiverBalanceBef.toNumber(),'ether')        
        receiverBalanceAft = toEther(receiverBalanceAft.toNumber(),'ether')
        
        assert.equal(senderBalanceAft,senderBalanceBef-10,"Accounts[1] didn't send 10 APS!")
        assert.equal(receiverBalanceAft,receiverBalanceBef + 10,"Accounts[2] didn't receive 10 APS!")
    })


    it('Buyer get 1 ether from refund with 10 APS',async function(){
        var checkBalances = async function(account){ // check APS, Ether balances
            var etherBalance = await web3.eth.getBalance(account)
            etherBalance = toEther(etherBalance.toNumber())
            var APSBalance = await APSContract.balanceOf(account)
            APSBalance = toEther(APSBalance.toNumber())
            return [etherBalance,APSBalance]
        }  

        const buyer= APSContract.address
        const seller = accounts[1]
        const decimals = 18
        const unit = 10 ** decimals
        const amount = 100

        sellerBalanceBef = await checkBalances(seller) // check balance before payment
        buyerBalanceBef = await checkBalances(buyer) // check balance before payment
        await APSContract.sell.sendTransaction(amount*unit,{from:seller,value:0}) // pay 1 ether to buy 1 APS
        sellerBalanceAft = await checkBalances(seller) // check balance after payment
        buyerBalanceAft = await checkBalances(buyer) // check balance after payment
        
        sellerAPSBalanceBef = sellerBalanceBef[1]
        sellerAPSBalanceAft = sellerBalanceAft[1]
        buyerEtherBalanceBef = buyerBalanceBef[0]
        buyerEtherBalanceAft = buyerBalanceAft[0]
        
        assert.equal(sellerAPSBalanceAft,sellerAPSBalanceBef-100,"Seller didn't pay 100 APS to get refund!")
        assert.equal(buyerEtherBalanceAft,buyerEtherBalanceBef-1,"Contract didn't give 1 ether refund to seller!")
    })



})
