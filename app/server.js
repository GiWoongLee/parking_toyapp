const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const db = require('./models')
const rpcCall = require('./rpccall')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json({type: 'application/*+json'})) // for pasing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

// TODO : Refactoring. Router needed and routing URLs to Controller codes.
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/home.html'))
})

// NOTE : Input(username,userLicensenumber,password) => Output(User Keystore)
app.post('/account/create', function (req, res) {
  // TODO : Refactoring. Check whether promise is the best solution to handle async functions
  // TODO : Refactoring. Change JSON file keys because of the maintenance. Possibly declare JSON first.
  var createUser = function () {
    var newUser = new Promise(function (resolve, reject) {
      db.User.create({name: req.body.username, licenseNumber: req.body.licenseNumber, password: req.body.password}) // TODO : Encrypt password with BCrypt
        .then(function (user) {
          resolve({userId: user.id, userPwd: user.password})
        })
        .catch(function (error) {
          console.log(error)
          reject(Error(error))
        })
    })
    return newUser
  }

  var createEthAccount = function () {
    var newEthAccount = new Promise(function (resolve, reject) {
      var ethAccount = web3.eth.accounts.create()
      resolve({ethAccountAddress: ethAccount.address,ethAccountPvKey: ethAccount.privateKey})
    })
    return newEthAccount
  }

  var createAccount = function (data) {
    var newAccount = new Promise(function (resolve, reject) {
      db.Account.create({address: data.ethAccountData.ethAccountAddress, userId: data.userData.userId})
        .then(function (account) {
          resolve('success')
        })
        .catch(function (error) {
          console.log(error)
          reject(Error(error))
        })
    })
    return newAccount
  }

  var encryptPrivateKey = function (data) {
    var encryptedKey = new Promise(function (resolve, reject) {
      var key = web3.eth.accounts.encrypt(data.ethAccountData.ethAccountPvKey, data.userData.userPwd)
      resolve({'encryptedPrivateKey': key})
    })
    return encryptedKey
  }

  Promise.all([createUser(), createEthAccount()])
    .then(function (data) {
      // NOTE : data as array containing newUser,newEthAccount data
      return {
        'userData': data[0],
        'ethAccountData': data[1]
      }
    })
    .then(function (data) {
      return Promise.all([createAccount(data), encryptPrivateKey(data)])
    })
    .then(function (data) {
      res.status(200).json({privateKey: data[1].encryptedPrivateKey}) // data as an array containing "",encryptedPrivateKey
    })
    .catch(function (error) {
      console.log(error)
      res.status(400).json({'error': error})
    })
})

// NOTE : Input(sender,receiver,amount) => Output()
app.post('/payment', function (req, res) {
  // TODO : Remove fixtures data(only used in ganache)
  web3.eth.getAccounts()
    .then(function (accounts) {
      console.log(accounts)
      return [accounts[0], accounts[1]] // sender and receiver
    })
    // TODO : unlock account first and signAndSendTranscation
    .then(function (accounts) {
      var senderAddress = accounts[0]
      web3.eth.sender.signTransaction({
        to: receiver.address,
        value: req.body.amount
      }, sender.privateKey)
        .then(function (encodedTransaction) {
          return web3.eth.accounts.sendSignedTransaction(encodedTransaction.rawTransaction)
        })
        .then(function (receipt) {
          res.status(200).json({ result: 'success'})
        })
        .catch(function (error) {
          console.log(error)
          res.status(400).json({result: 'failure', error: error })
        })
    })
    .catch(function (error) {
      console.log(error)
    })
// STEP1 : find password of sender
// const getSenderPassword = function () {
//   return new Promise(function (resolve, reject) {
//     db.User.findOne({where: {name: req.body.sender.name}})
//       .then(function (sender) { resolve(sender.password)})
//       .catch(function (error) {
//         console.log(error)
//         res.status(400).json({error: error})
//       })
//   })
// }
// STEP2 : find address of receiver
// const getReceiverAddress = function () {
//   return new Promise(function (resolve, reject) {
//     db.User.findOne({where: {name: req.body.receiver.name}})
//       .then(function (receiver) { resolve(receiver.address) })
//       .catch(function (err) {
//         console.log(err)
//         res.status(400).json({error: err})
//       })
//   })
// }
// Promise.all([getSenderPassword(), getReceiverAddress()])
// .then(function (data) {
//   // STEP3 : get account by decrypting keyStore with user password
//   var senderPassword = data[0]
// // return web3.eth.accounts.decrypt(req.body.sender.keyStore, senderPassword) // NOTE : get account from KeyStore
// })
// STEP4 : unlock account   
// .then(function(senderAccount){return web3.eth.accounts.unlock(senderAccount)})
// TODO : replace ganache-virtual sender account with real account on top of ethereum
// STEP5 : signTransaction and send ETH from sender to receiver
// .then(function (senderAccount) {
//   return senderAccount.signTransaction({
//     to: receiverAddress,
//     gas: req.body.amount
//   }, senderAccount.privateKey)
// })
// STEP6 : sendSignedTransaction
// .then(function (encodedTransaction) {
//     return web3
//       .eth
//       .accounts
//       .sendSignedTransaction(encodedTransaction.rawTransaction)
//   })
// .then(function (data) {
//   // (TODO)STEP7 : save transaction data on db and response to client
//   res.status(200).json({ result: 'success'})
// })
// .catch(function (error) {
//   console.log(error)
//   res.status(400).json({result: 'failure', error: error })
// })
})

app.listen(3000, function () {
  console.log('Toy App listening on port 3000')
  db.sequelize.authenticate().then(function () { // NOTE : Need to get used to Promise Statement
    console.log('Database connected')
  }).catch(function (err) {
    console.log(err)
  }).done()
})
