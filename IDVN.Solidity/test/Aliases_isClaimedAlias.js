const AliasesContract = artifacts.require("Aliases");
const IDVNTokenContract = artifacts.require("IDVNToken");
const { al1 } = require('./utils');

contract("Aliases.isClaimedAlias", accounts => { 
    let instance;

    beforeEach(async () => {
        const tokenInstance = await IDVNTokenContract.new();
        instance = await AliasesContract.new(accounts[1], tokenInstance.address, 0, 0);
    });

    it("should not throw when trying to check empty string alias", async () => {
        try {
            await instance.aliasToAddress('', {from: accounts[0]});
            assert.ok(true);
        } catch(ex) {
            assert.fail('did throw');
        }
    });

    it("should show claimed alias as claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});

        const result = await instance.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, true, "Alias is claimed but shown as not claimed");
    });

    it("should not show unclaimed alias as claimed", async () => {
        const result = await instance.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, false, "Alias is not claimed but shown as claimed");
    });

    it("should not show unclaimed alias as claimed multiple executions", async () => {
        const result1 = await instance.isClaimedAlias(al1, {from: accounts[0]});
        const result2 = await instance.isClaimedAlias(al1, {from: accounts[1]});

        assert.equal(result1 || result2, false, "Alias is not claimed but shown as claimed");
    });

    it("should show claimed alias as claimed when released and re-claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        await instance.claimAliasWithEth(al1, {from: accounts[0]});

        const result = await instance.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, true, "Alias is claimed but shown as not claimed");
    });

    it("should not show unclaimed alias as claimed when claimed and released", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});

        const result = await instance.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, false, "Alias is not claimed but shown as claimed");
    });
});