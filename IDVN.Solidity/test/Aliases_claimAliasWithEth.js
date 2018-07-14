const AliasesContract = artifacts.require("Aliases");
const IDVNTokenContract = artifacts.require("IDVNToken");

const { isRevert, al1, al2, fee } = require('./utils');

contract("Aliases.claimAliasWithEth", accounts => {
    let instance;

    beforeEach(async () => {
        const tokenInstance = await IDVNTokenContract.new();
        instance = await AliasesContract.new(accounts[1], tokenInstance.address, 0, 0);
    });    

    it("should throw when trying to claim alias when fee is not 0 and no value is sent", async () => {
        await instance.changeClaimEthFeeAmount(fee, {from: accounts[0]});
        try {
            await instance.claimAliasWithEth(al1, {from: accounts[0], value: 0});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to claim alias when fee is not 0 and less value is sent", async () => {
        await instance.changeClaimEthFeeAmount(fee, {from: accounts[0]});
        try {
            await instance.claimAliasWithEth(al1, {from: accounts[0], value: fee - 1});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });
        
    it("should claim alias when fee is 0", async () => {
        const initBalance = await web3.eth.getBalance(accounts[0]);
        const tx = await instance.claimAliasWithEth(al1, {from: accounts[0], value: 0});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});

        assert.equal(result, accounts[0], "Alias was not claimed");
        assert.equal(initBalance - tx.receipt.gasUsed, finalBalance, "Alias balance was modified");
    });
        
    it("should claim alias when fee is not 0 and exact value is sent", async () => {
        await instance.changeClaimEthFeeAmount(fee, {from: accounts[0]});

        const initBalance = await web3.eth.getBalance(accounts[0]);
        const tx = await instance.claimAliasWithEth(al1, {from: accounts[0], value: fee});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});

        assert.equal(result, accounts[0], "Alias was not claimed");
        assert.equal(initBalance - fee - tx.receipt.gasUsed, finalBalance, "Account was not charged correctly");
    });
        
    it("should claim alias when fee is not 0 and more value is sent", async () => {
        await instance.changeClaimEthFeeAmount(fee, {from: accounts[0]});

        const initBalance = await web3.eth.getBalance(accounts[0]);
        const tx = await instance.claimAliasWithEth(al1, {from: accounts[0], value: fee + 1});
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const result = await instance.aliasToAddress(al1, {from: accounts[0]});

        assert.equal(result, accounts[0], "Alias was not claimed");
        assert.equal(initBalance - fee - tx.receipt.gasUsed, finalBalance, "Account was not charged correctly");
    });
});