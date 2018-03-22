var tempUserName = 'giwoong'
var tempLicenseNumber = '2CJC569'
var tempPassword = 'tempPWD'

var register = function () {
  $('#registration').on('click', function (event) {
    $.ajax({
      method: 'POST',
      url: '/account/create',
      data: {
        username: tempUserName,
        licenseNumber: tempLicenseNumber,
        password: tempPassword
      },
      success: function (data) {
        console.log('Successful registration')
        // TODO : Make a file to download EncryptedPrivateKey
        // TODO : We need to handle this issue - User might need to write EncryptedPrivateKey everytime
        console.log(data.privateKey)
      },
      error: function (error) {
        console.log('Error making new account')
        console.log(error)
      }
    })
  })
}

// TODO : Refactoring. Need to come up with better solution than document.ready
$(document).ready(function (e) {
  register()
})
