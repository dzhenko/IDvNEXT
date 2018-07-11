let AliasesV1 = artifacts.require("AliasesV1");

let isRevert = function(ex){
    return ex && /revert/.test(ex.message);
}

contract("AliasesV1.aliasesCount_aliasAtIndex", accounts => {    
    let al1 = 'john@main.eth';
    let al2 = 'david@main.eth';
    let emptyAddress = '0x0000000000000000000000000000000000000000';
    let aliasesV1;

    beforeEach(async () => {
        aliasesV1 = await AliasesV1.new();
    });

    it("should throw when trying to get alias at non existing index", async () => {
        try {
            await aliasesV1.aliasAtIndex(1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should return 0 count when none claimed", async () => {
        const result = await aliasesV1.aliasesCount({from: accounts[0]});
        assert.equal(result, 0, "Did not return 0 when none claimed -> " + result);
    });

    it("should return 1 count when 1 claimed", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        const result = await aliasesV1.aliasesCount({from: accounts[0]});
        assert.equal(result, 1, "Did not return 1 when 1 claimed -> " + result);
    });

    it("should return 2 count when 2 claimed", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.claimAlias(al2, {from: accounts[0]});
        const result = await aliasesV1.aliasesCount({from: accounts[0]});
        assert.equal(result, 2, "Did not return 2 when 2 claimed -> " + result);
    });

    it("should return correct alias when requested at index 0", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        const count = await aliasesV1.aliasesCount({from: accounts[0]});
        const result = await aliasesV1.aliasAtIndex(count - 1, {from: accounts[0]});
        assert.equal(result, al1, "Did not return correct alias when requested at index 0 -> " + result);
    });

    it("should return correct alias when requested at index 1", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.claimAlias(al2, {from: accounts[0]});
        const count = await aliasesV1.aliasesCount({from: accounts[0]});
        const result = await aliasesV1.aliasAtIndex(count - 1, {from: accounts[0]});
        assert.equal(result, al2, "Did not return correct alias when requested at index 1 -> " + result);
    });
});