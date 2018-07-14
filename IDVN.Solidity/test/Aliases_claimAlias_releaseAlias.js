const AliasesContract = artifacts.require("Aliases");
const IDVNTokenContract = artifacts.require("IDVNToken");
const { isRevert, al1, al2 } = require('./utils');

contract("Aliases.claimAlias_releaseAlias", accounts => {
    let instance;

    beforeEach(async () => {
        const tokenInstance = await IDVNTokenContract.new();
        instance = await AliasesContract.new(accounts[1], tokenInstance.address, 0, 0);
    });

    it("should throw when trying to claim empty string alias", async () => {
        try {
            await instance.claimAliasWithEth('', {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to claim already claimed alias", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        try {
            await instance.claimAliasWithEth(al1, {from: accounts[0]});
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
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        try {
            await instance.releaseAlias(al2, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });   

    it("should release claimed alias", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        assert.ok(true);
    });
});