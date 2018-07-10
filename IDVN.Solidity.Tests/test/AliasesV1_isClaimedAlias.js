let AliasesV1 = artifacts.require("AliasesV1");

contract("AliasesV1.isClaimedAlias", accounts => { 
    let al1 = 'john@main.eth';
    
    let aliasesV1;
    beforeEach(async () => {
        aliasesV1 = await AliasesV1.new();
    });

    it("should not throw when trying to check empty string alias", async () => {
        try {
            await aliasesV1.aliasToAddress('', {from: accounts[0]});
            assert.ok(true);
        } catch(ex) {
            assert.fail('did throw');
        }
    });

    it("should show claimed alias as claimed", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});

        const result = await aliasesV1.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, true, "Alias is claimed but shown as not claimed -> " + result);
    });

    it("should not show unclaimed alias as claimed", async () => {
        const result = await aliasesV1.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, false, "Alias is not claimed but shown as claimed -> " + result);
    });

    it("should not show unclaimed alias as claimed multiple executions", async () => {
        const result1 = await aliasesV1.isClaimedAlias(al1, {from: accounts[0]});
        const result2 = await aliasesV1.isClaimedAlias(al1, {from: accounts[1]});

        assert.equal(result1 || result2, false, "Alias is not claimed but shown as claimed -> " + (result1 || result2));
    });

    it("should show claimed alias as claimed when released and re-claimed", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.releaseAlias(al1, {from: accounts[0]});
        await aliasesV1.claimAlias(al1, {from: accounts[0]});

        const result = await aliasesV1.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, true, "Alias is claimed but shown as not claimed -> " + result);
    });

    it("should not show unclaimed alias as claimed when claimed and released", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.releaseAlias(al1, {from: accounts[0]});

        const result = await aliasesV1.isClaimedAlias(al1, {from: accounts[0]});
        assert.equal(result, false, "Alias is not claimed but shown as claimed -> " + result);
    });
});