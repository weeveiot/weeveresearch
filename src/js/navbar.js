var web3;								// web3 instance
var contract_token;						// hold token contract
var contract_factory;					// hold factory contract
var connected = false;					// are we connected to the blockchain

var token_address = '';					// address of our token
var factory_address = '';				// address of our factory

var balanceETH = 0;						// ether balance of account
var balanceToken = 0;					// WEEV balance of account


var testTokensRequested = false;		// has this account requested test WEEV

require('requirejs');
Web3 = require('web3');


window.addEventListener('load', function() {
	//connect to web3
	if (typeof web3 !== 'undefined') {
		web3 = new Web3(web3.currentProvider);
	} else {
		console.log("falling back to ganache");
		web3 = new Web3(new web3.providers.HttpProvider("http://127.0.0.1:7545"));
	}
});
