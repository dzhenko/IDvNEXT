const AliasesContract = artifacts.require("Aliases");
const IDVNTokenContract = artifacts.require("IDVNToken");
const { al1 } = require('./utils');

contract("Aliases.isOwnAlias", accounts => { 
    let instance;

    beforeEach(async () => {
        const tokenInstance = await IDVNTokenContract.new();
        instance = await AliasesContract.new(accounts[1], tokenInstance.address, 0, 0);
    });

    it("should not throw when trying to check empty string alias", async () => {
        try {
            await instance.isOwnAlias('', {from: accounts[0]});
            assert.ok(true);
        } catch(ex) {
            assert.fail('did throw');
        }
    });

    it("should show claimed alias as own", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});

        const result = await instance.isOwnAlias(al1, {from: accounts[0]});
        assert.equal(result, true, "Alias is claimed but shown as not own");
    });

    it("should not show unclaimed alias as own", async () => {
        const result = await instance.isOwnAlias(al1, {from: accounts[0]});
        assert.equal(result, false, "Alias is not claimed but shown as own");
    });

    it("should not show claimed by other alias as own", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});

        const result = await instance.isOwnAlias(al1, {from: accounts[1]});
        assert.equal(result, false, "Alias is claimed by other but shown as own");
    });
});