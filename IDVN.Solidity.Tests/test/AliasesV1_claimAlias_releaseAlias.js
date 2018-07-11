let AliasesV1 = artifacts.require("AliasesV1");

let isRevert = function(ex){
    return ex && /revert/.test(ex.message);
}

contract("AliasesV1.claimAlias_releaseAlias", accounts => {    
    let al1 = 'john@main.eth';
    let al2 = 'david@main.eth';
    let emptyAddress = '0x0000000000000000000000000000000000000000';
    let aliasesV1;

    beforeEach(async () => {
        aliasesV1 = await AliasesV1.new();
    });

    it("should throw when trying to claim empty string alias", async () => {
        try {
            await aliasesV1.claimAlias('', {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to claim already claimed alias", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        try {
            await aliasesV1.claimAlias(al1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to release empty string alias", async () => {
        try {
            await aliasesV1.releaseAlias('', {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to release not claimed alias", async () => {
        try {
            await aliasesV1.releaseAlias(al1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    }); 

    it("should throw when trying to release not your claimed alias", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        try {
            await aliasesV1.releaseAlias(al2, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });   

    it("should release claimed alias", async () => {
        await aliasesV1.claimAlias(al1, {from: accounts[0]});
        await aliasesV1.releaseAlias(al1, {from: accounts[0]});
        assert.ok(true);
    });
});