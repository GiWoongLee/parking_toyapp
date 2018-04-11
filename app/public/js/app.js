// TODO : Remove fixture
var sender = {
  name: 'giwoong',
  licenseNumber: '2CJC569',
  password: 'lee',
  keyStore: {'version': 3,'id': '12f3b5f8-2be9-4172-a4ca-2fcf33e89004','address': '44d63f0d049c28d6d61bc8dc63d29ffb85992fe4','crypto': {'ciphertext': 'fa59fce46438437e0cfffdbc8e239dbb2da34f214f1b46750ebd8d328184ad8e','cipherparams': {'iv': '1df7b1d7da3a55c602eeb94e0e742d63'},'cipher': 'aes-128-ctr','kdf': 'scrypt','kdfparams': {'dklen': 32,'salt': '465a94f26e78acfae8daa8f734b1992539851ef46382d93e75e344b3d7bd13d2','n': 8192,'r': 8,'p': 1},'mac': '03cfec0654ee6f51df19ecbe5c21775d81cdba9bdec1d37d18a9038102fc8da1'}}
}

var receiver = {
  name: 'clay',
  licenseNumber: '3ZIW952',
  password: 'Dedeaux',
  keyStore: {'version': 3,'id': '2c938dcc-9d57-42f0-8a4d-26cc3eb77294','address': '495ce8ea1befd98b8f9b802a12fb71cc6bcd13a5','crypto': {'ciphertext': '72ce030053bf6f27bb3aa825599cae09c6c87ed639d420a110206debdd02218e','cipherparams': {'iv': '5160ad48aa53dc27af336262d54f9594'},'cipher': 'aes-128-ctr','kdf': 'scrypt','kdfparams': {'dklen': 32,'salt': 'ac05ec487a3611e3b0eda246de4a10370eb4cef570abd7a6c379c2c3f361d81e','n': 8192,'r': 8,'p': 1},'mac': '64bf82e37ae0fc818fdb24bad86b616891acaa974429c114a6100bf011c0cd35'}}
}

var amount = '0.00042 ETH' // example: 21000 units of gas at 20 GWEI

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

var register = function (user) {
  $('#registration').on('click', function (event) {
    $.ajax({
      method: 'POST',
      url: '/apis/account/create',
      data: {
        username: user.name,
        licenseNumber: user.licenseNumber,
        password: user.password
      },
      success: function (data) {
        console.log('Successful registration')
        console.log(data)
        $('#keyStore').text(JSON.stringify(data.encryptedPvKey))
      // TODO : Make a file to download EncryptedPrivateKey
      // TODO : We need to handle this issue - User might need to write EncryptedPrivateKey everytime
      },
      error: function (error) {
        console.log('Error making new account')
        console.log(error)
      }
    })
  })
}

var createWallet = function () {
  $('#createWallet').on('click', function (event) {
    $.ajax({
      method: 'POST',
      url: '/apis/wallet/create',
      data: {},
      success: function (data) {
        console.log('Successfully made a new wallet')
        console.log(data)
        $('#keyStore').text(JSON.stringify(data.mnemonic))
      },
      error: function (error) {
        console.log('Error making new wallet')
        console.log(error)
      }
    })
  })
}

var payment = function () {
  $('#payment').on('click', function (event) {
    $.ajax({
      method: 'POST',
      url: '/apis/payment',
      data: {
        paymentInfo: paymentInfo
      },
      success: function (msg) {
        console.log(msg.result)
      },
      error: function (msg) {
        console.log(msg.error)
      }
    })
  })
}

var showAllAccounts = function () {
  $('#allAccounts').on('click', function (event) {
    $.ajax({
      method: 'GET',
      url: 'apis/account/index',
      success: function (msg) {
        console.log(msg.result)
        console.log(msg.accounts)
      },
      error: function (msg) {
        console.log(msg.result)
        console.log(msg.error)
      }
    })
  })
}

// TODO : Refactoring. Need to come up with better solution than document.ready
$(document).ready(function (e) {
  register(receiver)
  payment()
  showAllAccounts()
  createWallet()
})
