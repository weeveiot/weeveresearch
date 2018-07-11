var Web3 = require('web3');

var accounts;
var userAccount;

var web3Provider;

var contract_token;
var contract_factory;

var token_address = '0x1cd91502f6179b6353bf6a89525183a90eca79a1';
var factory_address = '0xec717ba4d292ecfd2e60f2bdb65a17d86e93faa4';

var balanceETH = 0;
var weevBalance;

var testTokensRequested = false;



/************************************ Functions ***************************************************/


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
		console.log("pulling token contract");
		contract_token = new web3.eth.Contract(data.abi, token_address);
		contract_token.setProvider(web3Provider);
		console.log("token: " + contract_token);
	});

	$.getJSON('../../build/contracts/weeveFactory.json', function(data) {
		console.log("pulling factory contract");
		contract_factory = new web3.eth.Contract(data.abi, factory_address);
		contract_factory.setProvider(web3Provider);
		console.log("factory: " + contract_factory);
	});




	//do rest of things in timeout so that contract objects are loaded
	setTimeout(function(){
		console.log("inside timeout");

		//set the account display
		accounts = web3.eth.getAccounts();
		accounts.then(function(result) {
			userAccount = result[0]
			console.log(userAccount);
			$("#metamaskButton").text(userAccount);

			// set the ethereum balance display
			web3.eth.getBalance(userAccount, function(err, res) {
				if(Number(web3.utils.fromWei(res, 'ether')) != balanceETH) {
					balanceETH = Number(web3.utils.fromWei(res, 'ether'));
					$('#balanceETH').text(balanceETH + " ETH");
					$('#balanceETH').show();
					console.log("balance of current account: " + balanceETH);
				}
			});

			//set WEEV balance display and button to get test WEEV
			contract_token.methods.balanceOf(userAccount).call()
			.then(function(result){
				console.log(result);
			});

			if (!testTokensRequested) {
				$('#getTokens').show();
			}

		});

		console.log("end of setTimeout");
	}, 1000);

	let tokenButton = document.querySelector('#getTokens');
	tokenButton.addEventListener('click', function() {
		contract_factory.methods.getTestTokens();

		testTokensRequested = true;
		$('#getTokens').hide();

		//set WEEV balance display and button to get test WEEV
		contract_token.methods.balanceOf(userAccount).call()
		.then(function(result){
			console.log(result.data);
		});

	});

});
