const AliasesContract = artifacts.require("Aliases");
const { getTokenAddress, isRevert } = require('./utils');

contract("Aliases.changeClaimTokenFeeAmount", accounts => {    
    let instance;
    let tokenAddress;

    beforeEach(async () => {
        tokenAddress = await getTokenAddress();
        instance = await AliasesContract.new(accounts[1], tokenAddress, 0, 0);
    });
    
    it("should throw when trying to change token fee from not owner", async () => {
        try {
            await instance.changeClaimTokenFeeAmount(5, {from: accounts[1]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });    
    
    it("should have new amount set as 5", async () => {
        await instance.changeClaimTokenFeeAmount(5, {from: accounts[0]});
        const result = await instance.claimTokenFeeAmount.call();
        assert.equal(result, 5, "Fee is not set to 5");
    });
});