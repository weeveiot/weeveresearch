var Web3 = require('web3');

var account;
var FIRST_ACCOUNT = '0xE678581277CC36de3960A52DE86290872a039915';

var web3Provider;

var contract_token;
var contract_factory;

var token_address = '0xa4227b1fd67b65b579c9865780680d543ad8e294';
//var token_address = '0x21d6690715db82a7b11c17c7dda8cf7afac47fd7'
var factory_address = '0xe8c219f72fc117219bf0a7b134ff4f88f7d58a03';
//var factory_address = '0x6edb9a1e68258f1d7aebefb4fbd53c74f68031b7';

var balanceETH = 0;
var balanceToken = 0;

var testTokensRequested = false;



/************************************ Functions ***************************************************/

//sets account and ethereum balance of that account
function setAccount() {
	//set the account display
	account = web3.eth.accounts[0];
	console.log(account);
	$("#metamaskButton").text(account);

	// set the ethereum balance display
	web3.eth.getBalance(account, function(err, res) {
		balanceETH = Number(web3.fromWei(res, 'ether'));
		$('#balanceETH').text(balanceETH + " ETH");
		$('#balanceETH').show();
	});
}

//set weev balance of account, if haven't requested display button
function setWeevBalance() {
	//set WEEV balance display
	contract_token.balanceOf(account, function(errCall, result) {
		if(!errCall) {
			if(!testTokensRequested && Number(result) == 0) {
				$('#getTokens').show();
			} else {
				$('#getTokens').hide();
			}
			if(Number(result) != balanceToken) {
				balanceToken = Number(result);
				$('#balanceToken').text(web3.fromWei(balanceToken, 'ether') + " WEEV");
				$('#balanceToken').show();
			}
		} else {
			console.log(errCall);
		}
	});
}

function getTestTokens() {
	console.log("account before getTransCount: " + account);
	web3.eth.getTransactionCount(account, function(errNonce, nonce) {
		if(!errNonce) {
			contract_factory.getTestTokens({value:0, gas: 100000, from: FIRST_ACCOUNT, nonce: nonce}, function(errCall, result) {
				if(!errCall) {
					testTokensRequested = true;
					$('#getTokens').hide();
				} else {
					testTokensRequested = true;
					$('#getTokens').hide();
					console.log(errCall);
				}
			});
		}
	});
}

/************************************** UI *****************************/

window.addEventListener('load', function() {

	// connect to web3
	if (typeof web3 !== 'undefined') {
		web3Provider = web3.currentProvider;

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
		console.log('../../build/contracts/weeveToken.json');
		console.log("pulling token contract");
		//contract_token = new web3.eth.Contract(data.abi, token_address);
		contract_token = web3.eth.contract(data.abi).at(token_address);
		console.log("token: ", contract_token);
	});

	$.getJSON('../../build/contracts/weeveFactory.json', function(data) {
		console.log("pulling factory contract");
		//contract_factory = new web3.eth.Contract(data.abi, factory_address);
		contract_factory = web3.eth.contract(data.abi).at(factory_address);
		console.log("factory: ", contract_factory);
	});




	//do rest of things in timeout so that contract objects are loaded
	setTimeout(function(){
		console.log("inside timeout");

		setAccount();

		setWeevBalance();

		console.log("end of setTimeout");
	}, 1000);

	let tokenButton = document.querySelector('#getTokens');
	tokenButton.addEventListener('click', function() {
		getTestTokens();

		setWeevBalance();
	});

});
