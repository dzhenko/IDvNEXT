let AliasesContract = artifacts.require("Aliases");

let isRevert = function(ex){
    return ex && /revert/.test(ex.message);
}

contract("Aliases.claimAlias_releaseAlias", accounts => {    
    let al1 = 'john@main.eth';
    let al2 = 'david@main.eth';
    let emptyAddress = '0x0000000000000000000000000000000000000000';
    let instance;

    beforeEach(async () => {
        instance = await AliasesContract.new();
    });

    it("should throw when trying to claim empty string alias", async () => {
        try {
            await instance.claimAlias('', {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to claim already claimed alias", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        try {
            await instance.claimAlias(al1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to release empty string alias", async () => {
        try {
            await instance.releaseAlias('', {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to release not claimed alias", async () => {
        try {
            await instance.releaseAlias(al1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    }); 

    it("should throw when trying to release not your claimed alias", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        try {
            await instance.releaseAlias(al2, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });   

    it("should release claimed alias", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        assert.ok(true);
    });
});