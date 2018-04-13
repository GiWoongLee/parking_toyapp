var AutoPaymentParkingSystem = artifacts.require('./AutoPaymentParkingSystem');

module.exports = function(deployer){
    deployer.deploy(AutoPaymentParkingSystem);
};