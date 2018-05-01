module.exports = {
  networks: {
    development : {
      host : "127.0.0.1",
      port : 8545,
      network_id : "*" // match any network id
    },
    // ropsten : {
    //   provider : function() {
    //   return new HDWalletProvider(mnemonic,"https://ropsten.infura.io/");
    // }
    //   network_id : "3"
    // },
    // test : {
    //   provider : function() {
    //   return new HDWalletProvider(mnemonic, "https://127.0.0.1:8545/");
    // }
    //   network_id : "*",
    // }
    // live : {
    //   host : "",
    //   port : 80,
    //   network_id : "1", // Ethereum public network
    //   gas : 0,
    //   gasPrice : 0,
    //   from : "", // default address to use for any transaction Truffle makes during migrations
    //   provide : "" // web3 provider instance Truffle should use to talk to the Ethereum network.
    // }
  }  
};
