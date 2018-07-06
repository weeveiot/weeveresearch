var Web3 = require('web3');






// connect to web3
window.addEventListener('load', function() {

	if (typeof web3 !== 'undefined') {
		web3 = new Web3(web3.currentProvider);
	} else {
		//default to local ganache
		console.log("ganache");
		web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
	}
});
