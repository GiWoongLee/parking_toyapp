var APS = artifacts.require('./APS');

module.exports = function(deployer){
    deployer.deploy(APS,"Urbana","APS",10000);
};