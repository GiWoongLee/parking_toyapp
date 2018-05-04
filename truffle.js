module.exports = {
  networks: {
    development : {
      host : "127.0.0.1",
      port : 8545,
      network_id : "*" // match any network id
    },
    private : {
      host : "127.0.0.1",
      port : 8545,
      network_id : "",
      from : "",
      gas : 6712390
    },
    rinkeby : {
      host : "127.0.0.1",
      port : 8545,
      network_id : "4", // Rinkeby ID 4
      from : "",
      gas : 6712390
    },
    ropsten : {
      host : "127.0.0.1",
      port : 8545,
      network_id : "3",
      from : "",
      gas : 4500000
    },
    kovan : {
      host : "127.0.0.1",
      port : 9545,
      network_id : "42",
      from : "",
      gas : 6712390
    },
    live : {
      host : "127.0.0.1",
      port : 80,
      network_id : "1", // Ethereum public network
      gas : 0,
      gasPrice : 0,
      from : "", // default address to use for any transaction Truffle makes during migrations
      provide : "" // web3 provider instance Truffle should use to talk to the Ethereum network.
    }
  }  
};
