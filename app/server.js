const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const db = require('./models')
const blockchain = require('./blockchain.js')

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json({type: 'application/*+json'})) // for pasing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

// TODO : Use router.route(), router.param()

// TODO : Refactoring. Router needed and routing URLs to Controller codes.
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/home.html'))
})

app.post('/apis/account/create', function (req, res) {
  // TODO : Refactoring. Change JSON file keys because of the maintenance. Possibly declare JSON first.
  var createUser = function () {
    return new Promise(function (resolve, reject) {
      db.User.create({name: req.body.username, licenseNumber: req.body.licenseNumber, password: req.body.password}) // TODO : Encrypt password with BCrypt
        .then(function (user) {
          resolve({userId: user.id, userPwd: user.password})
        })
        .catch(function (error) {
          console.log(error)
          reject(Error(error))
        })
    })
  }

  var createAccount = function (data) {
    return new Promise(function (resolve, reject) {
      db.Account.create({address: data.ethAccountData.ethAccountAddress, userId: data.userData.userId})
        .then(function (account) {
          resolve('success')
        })
        .catch(function (error) {
          console.log(error)
          reject(Error(error))
        })
    })
  }

  Promise.all([createUser(), blockchain.registration()])
    .then(function (data) {
      // NOTE : data as array containing newUser,newEthAccount data
      return {
        'userData': data[0],
        'ethAccountData': data[1]
      }
    })
    .then(function (data) {
      return Promise.all([createAccount(data), blockchain.encryptPvKey(data)])
    })
    .then(function (data) {
      res.status(200).json({encryptedPvKey: data[1].encryptedPvKey}) // data as an array containing "",encryptedPrivateKey
    })
    .catch(function (error) {
      console.log(error)
      res.status(400).json({'error': error, api: '/apis/account/create'})
    })

})

// TODO : Remove fixture
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

// NOTE : Input(sender,receiver,amount) => Output()
app.post('/apis/payment', function (req, res) {})

// NOTE : Input(username,userLicensenumber,password) => Output(User Keystore)
app.post('/account/create', function (req, res) {
  // TODO : Refactoring. Check whether promise is the best solution to handle async functions

  // var createEthAccount = function () {
  //   var newEthAccount = new Promise(function (resolve, reject) {
  //     var ethAccount = web3.eth.accounts.create()
  //     resolve({ethAccountAddress: ethAccount.address,ethAccountPvKey: ethAccount.privateKey})
  //   })
  //   return newEthAccount
  // }

})

app.listen(3000, function () {
  console.log('Urbana App listening on port 3000')
  db.sequelize.authenticate()
    .then(function () { // NOTE : Need to get used to Promise Statement
      console.log('Database connected')
    })
    .catch(function (err) {
      console.log(err)
    })
    .done()
})
