const AliasesContract = artifacts.require("Aliases");
const { getTokenAddress, isRevert, emptyAddress } = require('./utils');

contract("Aliases.transferWallet", accounts => {    
    let instance;
    let tokenAddress;

    beforeEach(async () => {
        tokenAddress = await getTokenAddress();
        instance = await AliasesContract.new(accounts[1], tokenAddress, 0, 0);
    });
    
    it("should throw when trying to transfer wallet to empty address", async () => {
        try {
            await instance.transferWallet('', {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });
    
    it("should throw when trying to transfer wallet to address 0", async () => {
        try {
            await instance.transferWallet(emptyAddress, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });
    
    it("should throw when trying to transfer wallet from not wallet", async () => {
        try {
            await instance.transferWallet(accounts[1], {from: accounts[1]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });
    
    it("should throw when trying to transfer wallet from not owner and not wallet", async () => {
        try {
            await instance.transferWallet(accounts[3], {from: accounts[3]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });
    
    it("should have new wallet set as account 1", async () => {
        await instance.transferWallet(accounts[2], {from: accounts[0]});
        const result = await instance.wallet.call();
        assert.equal(result, accounts[2], "Initial wallet is not set to account 2");
    });
});