const AliasesContract = artifacts.require("Aliases");
const { isRevert, al1, al2, ownerAddress, tokenAddress } = require('./utils');

contract("Aliases.claimedAliasesCount", accounts => {    
    let instance;

    beforeEach(async () => {
        instance = await AliasesContract.new(ownerAddress, tokenAddress, 1, 1);
    });

    it("should show 0 aliases claimed initially", async () => {
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0 -> " + result);
    });

    it("should show 1 aliases claimed after 1 alias is claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1 -> " + result);
    });

    it("should show 1 aliases claimed after 1 alias is claimed twice", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        try {
            await instance.claimAlias(al1, {from: accounts[0]});
        } catch(ex) {
            assert.ok(isRevert(ex));
        }

        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1 -> " + result);
    });

    it("should show 0 aliases claimed after 1 alias is claimed and released", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0 -> " + result);
    });

    it("should show 0 aliases claimed after 1 alias is claimed and released twice", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        try {
            await instance.releaseAlias(al1, {from: accounts[0]});
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
        
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0 -> " + result);
    });

    it("should show 1 aliases claimed after 1 alias is claimed and released and re-claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        await instance.claimAlias(al1, {from: accounts[0]});
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1 -> " + result);
    });

    it("should increment to 2 aliases claimed after 2 aliases claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.claimAlias(al2, {from: accounts[0]});
        
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 2, "Claimed aliases are not 2 -> " + result);
    });
});