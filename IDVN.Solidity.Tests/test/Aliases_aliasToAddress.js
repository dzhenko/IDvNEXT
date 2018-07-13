let AliasesContract = artifacts.require("Aliases");

contract("Aliases.aliasToAddress", accounts => {    
    let al1 = 'john@main.eth';
    let al2 = 'david@main.eth';
    let emptyAddress = '0x0000000000000000000000000000000000000000';
    let instance;

    beforeEach(async () => {
        instance = await AliasesContract.new();
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
        assert.equal(result, emptyAddress, "Did return alias which is not claimed -> " + result);
    });

    it("should return address when claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});
        assert.equal(result, accounts[0], "Did return alias which is claimed -> " + result);
    });

    it("should not return address when not claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});
        assert.equal(result, emptyAddress, "Did return alias which is not claimed -> " + result);
    });

    it("should not return address when not claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.releaseAlias(al1, {from: accounts[0]});
        await instance.claimAlias(al1, {from: accounts[0]});
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});
        assert.equal(result, accounts[0], "Did return alias which is claimed -> " + result);
    });

    it("should return address when multiple aliases claimed", async () => {
        await instance.claimAlias(al1, {from: accounts[0]});
        await instance.claimAlias(al2, {from: accounts[1]});
        const result = await instance.aliasToAddress(al2, {from: accounts[0]});
        assert.equal(result, accounts[1], "Did return alias which is claimed -> " + result);
    });
});