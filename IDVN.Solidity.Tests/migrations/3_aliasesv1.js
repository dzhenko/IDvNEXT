const AliasesV1 = artifacts.require("./AliasesV1.sol");

module.exports = function(deployer) {
	deployer.deploy(AliasesV1);
};
