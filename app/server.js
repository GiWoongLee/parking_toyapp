const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const db = require('./models')

// TODO: Seperate Web3JS related stuff from this file.
const Web3 = require('web3')

// TODO : study exact concept of Provider
if (typeof web3 != 'undefined') {
  var web3 = new Web3(Web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
}

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json({type: 'application/*+json'})) // for pasing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded


// TODO : Refactoring. Router needed and routing URLs to Controller codes.
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/home.html'))
})

app.post('/account/create', function (req, res) {
  //TODO : Refactoring. Check whether promise is the best solution to handle async functions
  //TODO : Refactoring. Change JSON file keys because of the maintenance. Possibly declare JSON first.
  var createUser = function () {
    var newUser = new Promise(function (resolve, reject) {
      db.User.create({name: req.body.username, licenseNumber: req.body.licenseNumber, password: req.body.password}) // TODO : Encrypt password with BCrypt
        .then(function (user) {
          resolve({'userId': user.id, 'userPwd': user.password})
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
      resolve({'ethAccountAddress': ethAccount.address,'ethAccountPvKey': ethAccount.privateKey})
    })
    return newEthAccount
  }

  var createUserAndEthAccount = Promise.all([createUser(), createEthAccount()])
    .then(function (data) {
      // NOTE : data as array containing newUser,newEthAccount data
      return {
        'userData': data[0],
        'ethAccountData': data[1]
      }
    })
    .catch(function (error) {
      console.log(error)
      return error
    })

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
      console.log(typeof(key))
      resolve({'encryptedPrivateKey': key})
    })
    return encryptedKey
  }

  createUserAndEthAccount
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

app.listen(3000, function () {
  console.log('Toy App listening on port 3000')
  db.sequelize.authenticate().then(function () { // NOTE : Need to get used to Promise Statement
    console.log('Database connected')
  }).catch(function (err) {
    console.log(err)
  }).done()
})
