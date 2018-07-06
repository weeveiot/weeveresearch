var Web3 = require('web3');

var web3Provider;

var contract_token;
var contract_factory;

var token_address = '0x1cd91502f6179b6353bf6a89525183a90eca79a1';
var factory_address = '0xec717ba4d292ecfd2e60f2bdb65a17d86e93faa4';

window.addEventListener('load', function() {

	// connect to web3
	if (typeof web3 !== 'undefined') {
		web3Provider = web3.currentProvider;
	} else {
		//default to local ganache
		console.log("ganache");
		web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
		console.log("web3Provider: " + web3Provider);
	}

	web3 = new Web3(web3Provider);
	console.log("web3: " + web3);

	// get contract data for factory and token
	$.getJSON('abi_token.json', function(data) {
		contract_token = web3.eth.contract(data).at(token_address);
	});

	$.getJSON('abi_factory.json', function(data) {
		contract_factory = web3.eth.contract(data).at(factory_address);
	});

	console.log("token: " + contract_token);
	console.log("factory: " + contract_factory);
});
