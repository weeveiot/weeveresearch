var Web3 = require('web3');

var web3Provider;




// connect to web3
window.addEventListener('load', function() {

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
});
