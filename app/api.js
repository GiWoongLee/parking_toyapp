const Web3 = require('web3')
const hdkey = require('ethereumjs-wallet/hdkey')
const bip39 = require('bip39')
const Tx = require('ethereumjs-tx')

if (typeof web3 != 'undefined') {
  var web3 = new Web3(Web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545')) // NOTE : ganache-cli -p 8545 will open up port
}

// NOTE : Using webjs(v1.0) and ganache, payment from one account to another
// NOTE : input(txInfo) => transferEther(sender=>receiver) => output(status)
var transferEther = function () {
  return web3.eth.getAccounts()
    .then(function (accounts) {
      var privateKey = '0xf8d19b3c72f27a9db1a71f73d229afe5980419928b0b33232efb4033494f1562' // NOTE : privateKey always change when connected to ganache
      var sender = web3.eth.accounts.privateKeyToAccount(privateKey)
      var senderAddress = sender.address
      var receiverAddress = accounts[1]
      var rawTx = {
        from: senderAddress,
        to: receiverAddress,
        gasPrice: '200',
        gas: '210000',
        value: '1000',
        data: '' // NOTE : need to serialize and make it as HEX code to send data
      }

      var checkSenderBalance = function () {
        return web3.eth.getBalance(senderAddress)
          .then(function (balance) {console.log(balance)})
          .catch(function (error) {console.log(error)})
      }

      var checkReceiverBalance = function () {
        return web3.eth.getBalance(receiverAddress)
          .then(function (balance) {console.log(balance)})
          .catch(function (error) {console.log(error)})
      }

      // Case1 : Log into account with privateKey and signTransaction
      var makeTransaction = function () {
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
      // var privateKey = '0xf8d19b3c72f27a9db1a71f73d229afe5980419928b0b33232efb4033494f1562'
      // var makeTransaction = function () {
      //   return web3.eth.accounts.signTransaction(rawTx, privateKey)
      //     .then(function (signedTx) {
      //       return web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      //     })
      //     .then(function (receipt) {
      //       console.log(receipt)
      //     })
      //     .catch(function (error) {
      //       console.log(error)
      //     })
      // }
      // Case3 : Using Personal package
      // var makeTransaction = web3.eth.personal.unlockAccount(senderAddress, '')
      //   .then(function (result) {
      //     if (result) return web3.eth.personal.signTransaction(rawTx, '')
      //   })
      //   .then(function (signedTx) {
      //     return web3.eth.personal.sendTransaction(signedTx.rawTransaction)
      //   })
      //   .catch(function (error) {
      //     console.log(error)
      //   })

      checkSenderBalance()
        .then(checkReceiverBalance)
        .then(makeTransaction)
        .then(checkSenderBalance)
        .then(checkReceiverBalance)
        .catch(function (error) {console.log(error)})
    })
}

transferEther()

module.exports = web3
