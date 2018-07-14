const AliasesContract = artifacts.require("Aliases");
const { getTokenAddress, al1, al2, emptyAddress } = require('./utils');

contract("Aliases.aliasToAddress", accounts => {
    let instance;
    let tokenAddress;

    beforeEach(async () => {
        tokenAddress = await getTokenAddress();
        instance = await AliasesContract.new(accounts[1], tokenAddress, 0, 0);
    });

    it("should not throw when trying to check empty string alias", async () => {
        try {
            await instance.aliasToAddress('', {from: accounts[0]});
            assert.ok(true);
        } catch(ex) {
            assert.fail("did throw");
        }
    });

    it("should not throw when trying to check unclaimed alias", async () => {
        try {
            await instance.aliasToAddress(al1, {from: accounts[0]});
            assert.ok(true);
        } catch(ex) {
            assert.fail("did throw");
        }
    });

    it("should not return address when not claimed", async () => {
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});
        assert.equal(result, emptyAddress, "Did return alias which is not claimed");
    });

    it("should return address when claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});
        assert.equal(result, accounts[0], "Did return alias which is claimed");
    });

    it("should not return address when not claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});
        assert.equal(result, emptyAddress, "Did return alias which is not claimed");
    });

    it("should not return address when not claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});
        assert.equal(result, accounts[0], "Did return alias which is claimed");
    });

    it("should return address when multiple aliases claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        await instance.claimAliasWithEth(al2, {from: accounts[1]});
        const result = await instance.aliasToAddress(al2, {from: accounts[0]});
        assert.equal(result, accounts[1], "Did return alias which is claimed");
    });
});