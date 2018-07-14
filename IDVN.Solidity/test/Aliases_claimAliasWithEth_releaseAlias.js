const AliasesContract = artifacts.require("Aliases");
const { getTokenAddress, isRevert, al1, al2 } = require('./utils');

contract("Aliases.claimAliasWithEth_releaseAlias", accounts => {
    let instance;
    let tokenAddress;

    beforeEach(async () => {
        tokenAddress = await getTokenAddress();
        instance = await AliasesContract.new(accounts[1], tokenAddress, 0, 0);
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