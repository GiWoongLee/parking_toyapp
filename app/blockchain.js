const Web3 = require('web3')
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')
const utils = require('ethereumjs-util')

if (typeof web3 != 'undefined') {
  var web3 = new Web3(Web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545')) // NOTE : ganache-cli -p 8545 will open up port
}

// NOTE : make new wallet and account
var createWallet = function (accountIndex=0) {
  return new Promise(function (resolve, reject) {
    var mnemonic = bip39.generateMnemonic()
    var seed = bip39.mnemonicToSeed(mnemonic)
    var HDKey = hdkey.fromMasterSeed(seed)
    var path = "m/44'/60'/0'/0/" + accountIndex
    var defaultAccountHDKey = HDKey.derivePath(path)
    var defaultAccountPvKey = defaultAccountHDKey._hdkey._privateKey // Buffer
    var defaultAccountAddress = utils.privateToAddress(defaultAccountPvKey) // Buffer
    console.log(mnemonic)
    resolve(mnemonic)
    // resolve({ethAccountAddress: defaultAccountAddress.toString('hex'),ethAccountPvKey: defaultAccountPvKey.toString('hex')})
  })
}

// NOTE : return wallet and account
var loadWallet = function (mnemonic,accountIndex = 0) { // NOTE : wallet from ganache 10 accounts
  return new Promise(function (resolve, reject) {
    var seed = bip39.mnemonicToSeed(mnemonic)
    var HDKey = hdkey.fromMasterSeed(seed)
    var path = "m/44'/60'/0'/0/" + accountIndex 
    var accountHDKey = HDKey.derivePath(path)
    var accountPvKey = defaultAccountHDKey._hdkey._privateKey
    var accountAddress = utils.privateToAddress(accountPvKey)
    resolve({ethAccountAddress : accountAddress.toString('hex'), ethAccountPvKey : accountPvKey.toString('hex')})
  })
}

// NOTE : make new account on local node
var registration = function () {
  return new Promise(function (resolve, reject) {
    var ethAccount = web3.eth.accounts.create()
    resolve({ethAccountAddress: ethAccount.address,ethAccountPvKey: ethAccount.privateKey})
  })
}

// NOTE : encrypt PrivateKey
var encryptPvKey = function (data) {
  return new Promise(function (resolve, reject) {
    var key = web3.eth.accounts.encrypt(data.ethAccountData.ethAccountPvKey, data.userData.userPwd)
    resolve({'encryptedPvKey': key})
  })
}

// NOTE : input() => ouput(Promise:all)
var showAllAccounts = function () {
  return web3.eth.getAccounts()
}

// NOTE : input(privateKey) => output(Promise:account)
var getAccount = function (privateKey) {
  return new Promise(function (resolve, reject) {
    resolve(web3.eth.accounts.privateKeyToAccount(privateKey))
  })
}

// NOTE : input(address) => output(Promise:balance)
var getBalance = function (address) {
  return web3.eth.getBalance(address)
    .then(function (balance) { console.log(balance)})
    .catch(function (error) { throw new Error('getBalance Error')})
}

// NOTE : Using webjs(v1.0) and ganache, payment from one account to another
// NOTE : input(txInfo) => transferEther(sender=>receiver) => output(status)
var transferEther = function (sender, rawTx) {
  return sender.signTransaction(rawTx)
    .then(function (signedTx) {
      return web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    })
    .then(function (receipt) {
      console.log(receipt)
    })
    .catch(function (error) {
      console.log(error)
    })
}

// Case2 : signTransaction using privateKey
var transferEtherWithPvkey = function (sender, rawTx) {
  return web3.eth.accounts.signTransaction(rawTx, sender.privateKey)
    .then(function (signedTx) {
      return web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    })
    .then(function (receipt) {
      console.log(receipt)
    })
    .catch(function (error) {
      console.log(error)
    })
}

// Case3 : signTransaction using another entity's account
// NOTE : Relevant web3js libraries Not supported yet
// var transferEtherOfAnotherEntity = function (sender, rawTx) {
//   return web3.eth.personal.unlockAccount(sender.address, '')
//     .then(function (result) {
//       if (result) return web3.eth.personal.signTransaction(rawTx, '')
//     })
//     .then(function (signedTx) {
//       return web3.eth.personal.sendTransaction(signedTx.rawTransaction)
//     })
//     .catch(function (error) {
//       console.log(error)
//     })
// }

var payment = function (paymentInfo) { // TODO : Replace parameters with relevant params
  return Promise.all([getAccount(paymentInfo.pvKeys.sender), getAccount(paymentInfo.pvKeys.receiver)]) // STEP 1 : get accounts of sender/receiver
    .then(function (accounts) {
      var rawTx = {
        from: accounts[0].address, // sender
        to: accounts[1].address, // receiver
        gasPrice: paymentInfo.txInfo.gasPrice,
        gas: paymentInfo.txInfo.gas,
        value: paymentInfo.txInfo.value,
        data: paymentInfo.txInfo.data
      }

      return Promise.all(accounts.map(account => getBalance(account.address))) // STEP 2 : check balances of sender/receiver before transaction
        .then(() => transferEther(accounts[0], rawTx)) // STEP 3 : transferEther from sender to receiver
        .then(() => accounts.map(account => getBalance(account.address))) // STEP 4 : check balances of sender/receiver after transaction
        .catch(function (error) {console.log(error)})
    })
    .catch(function (error) {
      console.log(error)
      return error
    })
}

module.exports = {
  createWallet : createWallet,
  loadWallet : loadWallet,
  showAllAccounts: showAllAccounts,
  encryptPvKey: encryptPvKey,
  registration: registration,
  payment: payment
}