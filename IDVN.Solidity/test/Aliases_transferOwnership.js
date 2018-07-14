const AliasesContract = artifacts.require("Aliases");
const IDVNTokenContract = artifacts.require("IDVNToken");
const { isRevert, emptyAddress } = require('./utils');

contract("Aliases.transferOwnership", accounts => {    
    let instance;

    beforeEach(async () => {
        const tokenInstance = await IDVNTokenContract.new();
        instance = await AliasesContract.new(accounts[1], tokenInstance.address, 0, 0);
    });
    
    it("should throw when trying to transfer ownership to empty address", async () => {
        try {
            await instance.transferOwnership('', {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });
    
    it("should throw when trying to transfer ownership to 0 address", async () => {
        try {
            await instance.transferOwnership(emptyAddress, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });
    
    it("should throw when trying to transfer ownership from not owner", async () => {
        try {
            await instance.transferOwnership(accounts[1], {from: accounts[1]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });
    
    it("should have new owner set as account 1", async () => {
        await instance.transferOwnership(accounts[2], {from: accounts[0]});
        const result = await instance.owner.call();
        assert.equal(result, accounts[2], "Initial owner is not set to account 2");
    });
});