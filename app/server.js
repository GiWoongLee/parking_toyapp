const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()

const Web3 = require('web3')

if (typeof web3 != 'undefined') {
  var web3 = new Web3(Web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))
}

console.log(web3.eth.accounts.create())

app.use(express.static('public'))
app.use(bodyParser.json({type: 'application/*+json'})) // for pasing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.post('/wallet/create', function (req, res) {
  // TODO: make new wallet and save user data on database(username,licenseNumber,wallet address, privatekey)
  //   req.body.username, req.body.licenseNumber
  var newWallet = web3.eth.accounts.create();
})

app.listen(3000, function () {
  console.log('Toy App listening on port 3000')
});