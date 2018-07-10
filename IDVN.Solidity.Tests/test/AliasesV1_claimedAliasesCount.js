let AliasesV1 = artifacts.require("AliasesV1");

let isRevert = function(ex){
    return ex && /revert/.test(ex.message);
}

contract("AliasesV1.claimedAliasesCount", accounts => {    
    let al1 = 'john@main.eth';
    let al2 = 'david@main.eth';
    
    let aliasesV1;

    beforeEach(async () => {
        aliasesV1 = await AliasesV1.new();
    });

    it("should show 0 aliases claimed initially", async () => {
        const result = await aliasesV1.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0 -> " + result);
    });

    it("should show 1 aliases claimed after 1 alias is claimed", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        const result = await aliasesV1.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1 -> " + result);
    });

    it("should show 1 aliases claimed after 1 alias is claimed twice", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        try {
            await aliasesV1.claimAlias(al1, {from: accounts[0]});
        } catch(ex) {
            if (!isRevert(ex)){
                throw ex;
            }
        }

        const result = await aliasesV1.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1 -> " + result);
    });

    it("should show 0 aliases claimed after 1 alias is claimed and released", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.releaseAlias(al1, {from: accounts[0]});
        const result = await aliasesV1.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0 -> " + result);
    });

    it("should show 0 aliases claimed after 1 alias is claimed and released twice", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.releaseAlias(al1, {from: accounts[0]});
        try {
            await aliasesV1.releaseAlias(al1, {from: accounts[0]});
        } catch(ex) {
            if (!isRevert(ex)){
                throw ex;
            }
        }
        
        const result = await aliasesV1.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0 -> " + result);
    });

    it("should show 1 aliases claimed after 1 alias is claimed and released and re-claimed", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.releaseAlias(al1, {from: accounts[0]});
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        const result = await aliasesV1.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1 -> " + result);
    });

    it("should increment to 2 aliases claimed after 2 aliases claimed", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.claimAlias(al2, {from: accounts[0]});
        
        const result = await aliasesV1.claimedAliasesCount.call();
        assert.equal(result, 2, "Claimed aliases are not 2 -> " + result);
    });
});