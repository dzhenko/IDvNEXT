const AliasesContract = artifacts.require("Aliases");
const IDVNTokenContract = artifacts.require("IDVNToken");

const { isRevert, al1, al2, fee } = require('./utils');

contract("Aliases.claimAliasWithToken", accounts => {
    let instance;
    let tokenInstance;

    beforeEach(async () => {
        tokenInstance = await IDVNTokenContract.new();
        instance = await AliasesContract.new(accounts[1], tokenInstance.address, 0, 0);
    });    

    it("should throw when trying to claim alias when fee is not 0 and no token is sent", async () => {
        const approve = await tokenInstance.approve(instance.address, 0);
        assert.ok(approve);

        await instance.changeClaimTokenFeeAmount(fee, {from: accounts[0]});
        try {
            await instance.claimAliasWithToken(al1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }

        assert.ok(approve);
    });

    it("should throw when trying to claim alias when fee is not 0 and less token is sent", async () => {
        const approve = await tokenInstance.approve(instance.address, fee - 1);
        assert.ok(approve);

        await instance.changeClaimTokenFeeAmount(fee, {from: accounts[0]});
        try {
            await instance.claimAliasWithToken(al1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });    
        
    it("should claim alias when fee is 0", async () => {
        const initBalance = await tokenInstance.balanceOf(accounts[0]);
        await instance.claimAliasWithToken(al1, {from: accounts[0]});
        const finalBalance = await tokenInstance.balanceOf(accounts[0]);
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});

        assert.equal(result, accounts[0], "Alias was not claimed");
        assert.equal(+initBalance, +finalBalance, "Alias token balance was modified");
    });
        
    it("should claim alias when fee is not 0 and exact token is sent", async () => {
        const approve = await tokenInstance.approve(instance.address, fee);
        assert.ok(approve);

        await instance.changeClaimTokenFeeAmount(fee, {from: accounts[0]});

        const initBalance = await tokenInstance.balanceOf(accounts[0]);
        await instance.claimAliasWithToken(al1, {from: accounts[0]});
        const finalBalance = await tokenInstance.balanceOf(accounts[0]);
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});

        assert.equal(result, accounts[0], "Alias was not claimed");
        assert.equal(initBalance - fee, finalBalance, "Alias token balance was modified");
    });
        
    it("should claim alias when fee is not 0 and more token is sent", async () => {
        const approve = await tokenInstance.approve(instance.address, fee + 1);
        assert.ok(approve);

        await instance.changeClaimTokenFeeAmount(fee, {from: accounts[0]});

        const initBalance = await tokenInstance.balanceOf(accounts[0]);
        await instance.claimAliasWithToken(al1, {from: accounts[0]});
        const finalBalance = await tokenInstance.balanceOf(accounts[0]);
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});

        assert.equal(result, accounts[0], "Alias was not claimed");
        assert.equal(initBalance - fee, finalBalance, "Alias token balance was modified");
    });
});