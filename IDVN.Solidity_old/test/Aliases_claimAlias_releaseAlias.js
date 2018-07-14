const AliasesContract = artifacts.require("Aliases");
const { isRevert, al1, al2, ownerAddress, tokenAddress } = require('./utils');

contract("Aliases.claimAlias_releaseAlias", accounts => {
    let instance;

    beforeEach(async () => {
        instance = await AliasesContract.new(ownerAddress, tokenAddress, 1, 1);
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