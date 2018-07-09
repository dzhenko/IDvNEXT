let AliasesV1 = artifacts.require("AliasesV1");

contract("AliasesV1", accounts => {
    it("should not show unclaimed alias as claimed", async () => {
        let instance = await AliasesV1.deployed();
        const result = await instance.isClaimedAlias('ivan').call(accounts[0]);
        Assert.equal(result, false, "Ivan is not claimed but shown as claimed");
    });
});


/*
const Funding = artifacts.require("Funding");
const { increaseTime } = require("./utils");

const DAY = 3600 * 24;
const FINNEY = 10 ** 15;

contract("Funding", accounts => {
	const [firstAccount, secondAccount, thirdAccount] = accounts;
    let funding;

    beforeEach(async () => {
        funding = await Funding.new(DAY, 100 * FINNEY);
    });

    it("allows to withdraw funds after time is up and goal is not reached", async () => {
        await funding.donate({from: secondAccount, value: 50 * FINNEY});
        const initBalance = web3.eth.getBalance(secondAccount);
        assert.equal((await funding.balances.call(secondAccount)), 50 * FINNEY);
        await increaseTime(DAY);
        await funding.refund({from: secondAccount});
        const finalBalance = web3.eth.getBalance(secondAccount);
        assert.ok(finalBalance.greaterThan(initBalance));
    });

    it("does not allow to withdraw funds after time in up and goal is reached", async () => {
        await funding.donate({from: secondAccount, value: 100 * FINNEY});
        assert.equal((await funding.balances.call(secondAccount)), 100 * FINNEY);
        await increaseTime(DAY);
        try {
            await funding.refund({from: secondAccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
    });

    it("does not allow to withdraw funds before time in up and goal is not reached", async () => {
        await funding.donate({from: secondAccount, value: 50 * FINNEY});
        assert.equal((await funding.balances.call(secondAccount)), 50 * FINNEY);
        try {
            await funding.refund({from: secondAccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
    });

    it("allows an owner to withdraw funds when goal is reached", async () => {
        await funding.donate({from: secondAccount, value: 30 * FINNEY});
        await funding.donate({from: thirdAccount, value: 70 * FINNEY});
        const initBalance = web3.eth.getBalance(firstAccount);
        assert.equal(web3.eth.getBalance(funding.address), 100 * FINNEY);
        await funding.withdraw();
        const finalBalance = web3.eth.getBalance(firstAccount);
        assert.ok(finalBalance.greaterThan(initBalance)); // hard to be exact due to the gas usage
    });

    it("does not allow non-owners to withdraw funds", async () => {
        funding = await Funding.new(DAY, 100 * FINNEY, {from: secondAccount});
        await funding.donate({from: firstAccount, value: 100 * FINNEY});
        try {
            await funding.withdraw();
            assert.fail();
        } catch (err) {
         assert.ok(/revert/.test(err.message));
        }
    });

    it("does not allow for donations when time is up", async () => {
        await funding.donate({from: firstAccount, value: 10 * FINNEY});
        await increaseTime(DAY);
        try {
            await funding.donate({from: firstAccount, value: 10 * FINNEY});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
    });

    it("finishes fundraising when time is up", async () => {
        assert.equal(await funding.isFinished.call(), false);
        await increaseTime(DAY);
        assert.equal(await funding.isFinished.call(), true);
    });

    it("keeps track of donator balance", async () => {

        await funding.donate({from: firstAccount, value: 5 * FINNEY});
        await funding.donate({from: secondAccount, value:  15 * FINNEY});
        await funding.donate({from: secondAccount, value:  3 * FINNEY});

        assert.equal(await funding.balances.call(firstAccount), 5 * FINNEY);
        assert.equal(await funding.balances.call(secondAccount), 18 * FINNEY);
    });

	it("accepts donations", async () => {
	    await funding.donate({from: firstAccount, value:  10 * FINNEY});
	    await funding.donate({from: secondAccount, value:  20 * FINNEY});
	    assert.equal(await funding.raised.call(), 30 * FINNEY);
	});

	it("sets an owner", async () => {
		assert.equal(await funding.owner.call(), firstAccount);
	});
});

*/