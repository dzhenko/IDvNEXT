const AliasesContract = artifacts.require("Aliases");
const { getTokenAddress, isRevert, emptyAddress } = require('./utils');

contract("Aliases.ctorArgs", accounts => {    
    let instance;
    let tokenAddress;

    it("should throw when trying to deploy with 0 address as wallet", async () => {
        const tokenAddress = await getTokenAddress();
        
        try {
            await AliasesContract.new(emptyAddress, tokenAddress, 0, 0);
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to deploy with empty address as wallet", async () => {
        const tokenAddress = await getTokenAddress();
        
        try {
            await AliasesContract.new('', tokenAddress, 0, 0);
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });    

    it("should throw when trying to deploy with 0 address as token address", async () => {
        try {
            await AliasesContract.new(accounts[1], emptyAddress, 0, 0);
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to deploy with empty address as token address", async () => {
        try {
            await AliasesContract.new(accounts[1], '', 0, 0);
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should have initially wallet set as account 1", async () => {
        const tokenAddress = await getTokenAddress();
        const instance = await AliasesContract.new(accounts[1], tokenAddress, 0, 0);

        const result = await instance.wallet.call();
        assert.equal(result, accounts[1], "Initial wallet is not set to ctor param");
    });

    it("should have initially owner set as account 0", async () => {
        const tokenAddress = await getTokenAddress();
        const instance = await AliasesContract.new(accounts[1], tokenAddress, 0, 0);

        const result = await instance.owner.call();
        assert.equal(result, accounts[0], "Initial owner is not set to ctor param");
    });
    
    it("should have initially eth fee amount set as 0", async () => {
        const tokenAddress = await getTokenAddress();
        const instance = await AliasesContract.new(accounts[1], tokenAddress, 0, 0);

        const result = await instance.claimEthFeeAmount.call();
        assert.equal(result, 0, "Initial eth fee not set to 0");
    });
    
    it("should have initially token fee amount set as 0", async () => {
        const tokenAddress = await getTokenAddress();
        const instance = await AliasesContract.new(accounts[1], tokenAddress, 0, 0);

        const result = await instance.claimTokenFeeAmount.call();
        assert.equal(result, 0, "Initial token fee not set to 0");
    });
});