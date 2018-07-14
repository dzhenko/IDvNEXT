const AliasesContract = artifacts.require("Aliases");
const { isRevert, al1, al2, ownerAddress, tokenAddress } = require('./utils');

contract("Aliases.aliasesCount_aliasAtIndex", accounts => {
    let instance;

    beforeEach(async () => {
        instance = await AliasesContract.new(ownerAddress, tokenAddress, 1, 1);
    });

    it("should throw when trying to get alias at non existing index", async () => {
        try {
            await instance.aliasAtIndex(1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should return 0 count when none claimed", async () => {
        const result = await instance.aliasesCount({from: accounts[0]});
        assert.equal(result, 0, "Did not return 0 when none claimed -> " + result);
    });

    it("should return 1 count when 1 claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        const result = await instance.aliasesCount({from: accounts[0]});
        assert.equal(result, 1, "Did not return 1 when 1 claimed -> " + result);
    });

    it("should return 2 count when 2 claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.claimAlias(al2, {from: accounts[0]});
        const result = await instance.aliasesCount({from: accounts[0]});
        assert.equal(result, 2, "Did not return 2 when 2 claimed -> " + result);
    });

    it("should return correct alias when requested at index 0", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        const count = await instance.aliasesCount({from: accounts[0]});
        const result = await instance.aliasAtIndex(count - 1, {from: accounts[0]});
        assert.equal(result, al1, "Did not return correct alias when requested at index 0 -> " + result);
    });

    it("should return correct alias when requested at index 1", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.claimAlias(al2, {from: accounts[0]});
        const count = await instance.aliasesCount({from: accounts[0]});
        const result = await instance.aliasAtIndex(count - 1, {from: accounts[0]});
        assert.equal(result, al2, "Did not return correct alias when requested at index 1 -> " + result);
    });
});