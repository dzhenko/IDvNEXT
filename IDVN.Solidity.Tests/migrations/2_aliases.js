const Aliases = artifacts.require("./Aliases.sol");

module.exports = function(deployer) {
	deployer.deploy(Aliases);
};
