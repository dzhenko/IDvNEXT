const AliasesContract = artifacts.require("Aliases");
const IDVNTokenContract = artifacts.require("IDVNToken");
const { isRevert, al1, al2 } = require('./utils');

contract("Aliases.claimedAliasesCount", accounts => {    
    let instance;
    let watcher;

    beforeEach(async () => {
        const tokenInstance = await IDVNTokenContract.new();
        instance = await AliasesContract.new(accounts[1], tokenInstance.address, 0, 0);
        watcher = instance.ClaimedAliasesCountChanged();
    });

    it("should show 0 aliases claimed initially", async () => {
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0");
    });

    it("should show 1 aliases claimed after 1 alias is claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});

        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1");

        const events = await watcher.get();
        assert.equal(events.length, 1, "Raised events are not 1");
        assert.equal(events[0].args.claimedAliasesCount.valueOf(), 1, "Raised event arg is not 1");
    });

    it("should show 1 aliases claimed after 1 alias is claimed twice", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});        
        var events = await watcher.get();

        try {
            await instance.claimAliasWithEth(al1, {from: accounts[0]});
            events = events.concat(await watcher.get());
        } catch(ex) {
            assert.ok(isRevert(ex));
        }

        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1");

        assert.equal(events.length, 1, "Raised events are not 1");
        assert.equal(events[0].args.claimedAliasesCount.valueOf(), 1, "Raised event arg is not 1");
    });

    it("should show 0 aliases claimed after 1 alias is claimed and released", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        var events = await watcher.get();
        await instance.releaseAlias(al1, {from: accounts[0]});
        events = events.concat(await watcher.get());

        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0");
        
        assert.equal(events.length, 2, "Raised events are not 2");
        assert.equal(events[0].args.claimedAliasesCount.valueOf(), 1, "Raised event 1 arg is not 1");
        assert.equal(events[1].args.claimedAliasesCount.valueOf(), 0, "Raised event 2 arg is not 0");
    });

    it("should show 0 aliases claimed after 1 alias is claimed and released twice", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        var events = await watcher.get();
        await instance.releaseAlias(al1, {from: accounts[0]});
        events = events.concat(await watcher.get());
        try {
            await instance.releaseAlias(al1, {from: accounts[0]});
            events = events.concat(await watcher.get());
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
        
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 0, "Claimed aliases are not 0");
        
        assert.equal(events.length, 2, "Raised events are not 2");
        assert.equal(events[0].args.claimedAliasesCount.valueOf(), 1, "Raised event 1 arg is not 1");
        assert.equal(events[1].args.claimedAliasesCount.valueOf(), 0, "Raised event 2 arg is not 0");
    });

    it("should show 1 aliases claimed after 1 alias is claimed and released and re-claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        var events = await watcher.get();
        await instance.releaseAlias(al1, {from: accounts[0]});
        events = events.concat(await watcher.get());
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        events = events.concat(await watcher.get());

        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 1, "Claimed aliases are not 1");
        
        assert.equal(events.length, 3, "Raised events are not 3");
        assert.equal(events[0].args.claimedAliasesCount.valueOf(), 1, "Raised event 1 arg is not 1");
        assert.equal(events[1].args.claimedAliasesCount.valueOf(), 0, "Raised event 2 arg is not 0");
        assert.equal(events[2].args.claimedAliasesCount.valueOf(), 1, "Raised event 3 arg is not 1");
    });

    it("should increment to 2 aliases claimed after 2 aliases claimed", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        var events = await watcher.get();
        await instance.claimAliasWithEth(al2, {from: accounts[0]});
        events = events.concat(await watcher.get());
        
        const result = await instance.claimedAliasesCount.call();
        assert.equal(result, 2, "Claimed aliases are not 2");

        assert.equal(events.length, 2, "Raised events are not 2");
        assert.equal(events[0].args.claimedAliasesCount.valueOf(), 1, "Raised event 1 arg is not 1");
        assert.equal(events[1].args.claimedAliasesCount.valueOf(), 2, "Raised event 2 arg is not 2");
    });
});