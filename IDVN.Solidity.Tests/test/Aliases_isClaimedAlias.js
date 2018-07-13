let AliasesContract = artifacts.require("Aliases");

contract("Aliases.isClaimedAlias", accounts => { 
    let al1 = 'john@main.eth';
    
    let instance;
    beforeEach(async () => {
        instance = await AliasesContract.new();
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
        await instance.claimAlias(al1, {from: accounts[0]});

        const result = await instance.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, true, "Alias is claimed but shown as not claimed -> " + result);
    });

    it("should not show unclaimed alias as claimed", async () => {
        const result = await instance.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, false, "Alias is not claimed but shown as claimed -> " + result);
    });

    it("should not show unclaimed alias as claimed multiple executions", async () => {
        const result1 = await instance.isClaimedAlias(al1, {from: accounts[0]});
        const result2 = await instance.isClaimedAlias(al1, {from: accounts[1]});

        assert.equal(result1 || result2, false, "Alias is not claimed but shown as claimed -> " + (result1 || result2));
    });

    it("should show claimed alias as claimed when released and re-claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        await instance.claimAlias(al1, {from: accounts[0]});

        const result = await instance.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, true, "Alias is claimed but shown as not claimed -> " + result);
    });

    it("should not show unclaimed alias as claimed when claimed and released", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});

        const result = await instance.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, false, "Alias is not claimed but shown as claimed -> " + result);
    });
});