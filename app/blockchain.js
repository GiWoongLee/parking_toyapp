const Web3 = require('web3')
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')
const utils = require('ethereumjs-util')

if (typeof web3 != 'undefined') {
  var web3 = new Web3(Web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545')) // NOTE : ganache-cli -p 8545 will open up port
}

// NOTE : register account on ethereum network
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
  showAllAccounts: showAllAccounts,
  encryptPvKey: encryptPvKey,
  registration: registration,
  payment: payment
}


//TODO : remove fixture
var paymentInfo = {
  pvKeys: { // hardcoded private keys 
    sender: '0x32d4e4b8deae4967f6ec305683921b1d46517767ef7a3411c27bbcf24fa7b757',
    receiver: '0x90e40b307bd5ee5c7f5285aecffcf0fb223ff1cf802d913237ecaf2f962e251e'
  },
  txInfo: {
    gasPrice: '200', // string
    gas: '210000', // string
    value: '1000', // string
    data: '' // string
  }
}

var loadGanacheWallet = function () { // NOTE : wallet from ganache 10 accounts
  var mnemonic = 'humor tragic easy wing rack silk diesel suit cloth alley unknown wine'
  var path = "m/44'/60'/0'/0/0" // first account
  var seed = bip39.mnemonicToSeed(mnemonic)
  var HDKey = hdkey.fromMasterSeed(seed)
  var examHDKey = HDKey.derivePath(path)
  return examHDKey._hdkey._privateKey
}

var createWallet = function () {
  var mnemonic = bip39.generateMnemonic()
  var path = "m/44'/60'/0'/0/0" // first account
  var seed = bip39.mnemonicToSeed(mnemonic)
  var HDKey = hdkey.fromMasterSeed(seed)
  var examHDKey = HDKey.derivePath(path)
  return examHDKey._hdkey._privateKey
}

var transferFromWalletToWallet = function () {
  var pvKey1 = loadGanacheWallet()
  var pvKey2 = createWallet()
  paymentInfo.pvKeys.sender = "0x" + pvKey1.toString('hex')
  paymentInfo.pvKeys.receiver = "0x" + pvKey2.toString('hex')
  payment(paymentInfo)
}

transferFromWalletToWallet()
