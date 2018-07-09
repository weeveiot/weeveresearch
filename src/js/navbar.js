var Web3 = require('web3');

var accounts;
var userAccount;

var web3Provider;

var contract_token;
var contract_factory;

var token_address = '0x1cd91502f6179b6353bf6a89525183a90eca79a1';
var factory_address = '0xec717ba4d292ecfd2e60f2bdb65a17d86e93faa4';

var balanceETH = 0;

window.addEventListener('load', function() {

	// connect to web3
	if (typeof web3 !== 'undefined') {
		//web3Provider = web3.currentProvider;

		web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
		console.log("web3Provider: " + web3Provider);		//FIXME
	} else {
		//default to local ganache
		console.log("ganache");
		web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
		console.log("web3Provider: " + web3Provider);
	}

	web3 = new Web3(web3Provider);
	console.log("web3: " + web3);

	// get contract data for factory and token
	$.getJSON('../../build/contracts/weeveToken.json', function(data) {
		console.log("pulling token contract");
		contract_token = new web3.eth.Contract(data.abi, token_address);
		console.log("token: " + contract_token);
	});

	$.getJSON('../../build/contracts/weeveFactory.json', function(data) {
		console.log("pulling factory contract");
		contract_factory = new web3.eth.Contract(data.abi, factory_address);
		console.log("factory: " + contract_factory);
	});

	//do rest of things in timeout so that contract objects are loaded
	setTimeout(function(){
		console.log("inside timeout");

		accounts = web3.eth.getAccounts();
		accounts.then(function(result) {
			userAccount = result[0]
			console.log(userAccount);
			web3.eth.getBalance(userAccount, function(err, res) {
				if(Number(web3.utils.fromWei(res, 'ether')) != balanceETH) {
					balanceETH = Number(web3.utils.fromWei(res, 'ether'));
					console.log("balance of current account: " + balanceETH);
				}
			});
		});

	}, 1000);


});
