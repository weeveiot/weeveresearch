var Token = artifacts.require("../contracts/weeveToken.sol");
var Voting = artifacts.require("../contracts/weeveVoting.sol");
var Factory = artifacts.require("../contracts/weeveFactory.sol");
var DLL = artifacts.require("../contracts/libraries/DLL.sol");
var AttributeStore = artifacts.require("../contracts/libraries/AttributeStore.sol");

module.exports = function(deployer) {
	deployer.deploy(Token)
	.then(function() {
		deployer.deploy(DLL);
		deployer.deploy(AttributeStore)
		.then(function() {
			deployer.link(DLL, Voting);
			deployer.link(AttributeStore, Voting);
			deployer.deploy(Voting)
			.then(function() {
				return deployer.deploy(Factory, Token.address, Voting.address);
			})
		})
	});
};
