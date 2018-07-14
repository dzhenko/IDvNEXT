const AliasesContract = artifacts.require("Aliases");
const IDVNTokenContract = artifacts.require("IDVNToken");
const { al1, hash1, hash2, isRevert } = require('./utils');

contract("Aliases.readAvatar_updateAvatar", accounts => { 
    let instance;

    beforeEach(async () => {
        const tokenInstance = await IDVNTokenContract.new();
        instance = await AliasesContract.new(accounts[1], tokenInstance.address, 0, 0);
    });

    it("should throw when trying to update with empty alias", async () => {
        try {
            await instance.updateAvatarHash('', hash1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to update with empty hash", async () => {
        try {
            await instance.updateAvatarHash(al1, '', {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to update not claimed alias", async () => {
        try {
            await instance.updateAvatarHash(al1, hash1, {from: accounts[0]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should throw when trying to update not yours alias", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        try {
            await instance.updateAvatarHash(al1, hash1, {from: accounts[1]});
            assert.fail("did not throw");
        } catch(ex) {
            assert.ok(isRevert(ex));
        }
    });

    it("should read when updated", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        await instance.updateAvatarHash(al1, hash1, {from: accounts[0]});
        const result = await instance.readAvatarHash(al1);

        assert.equal(result, hash1, "Alias hash not the updated val");
    });

    it("should read latest value when updated", async () => {
        await instance.claimAliasWithEth(al1, {from: accounts[0]});
        await instance.updateAvatarHash(al1, hash1, {from: accounts[0]});
        await instance.updateAvatarHash(al1, hash2, {from: accounts[0]});
        const result = await instance.readAvatarHash(al1);

        assert.equal(result, hash2, "Alias hash not the updated val");
    });
});

/*
function updateAvatarHash(string _alias, string _hash) public {
    require(!_isEmptyString(_alias), 'Invalid alias.');
    require(!_isEmptyString(_hash), 'Invalid hash.');
    require(isClaimedAlias(_alias), 'Alias not claimed yet.');
    
    aliasesMap[_alias].avatarHash = _hash;
}

function readAvatarHash(string _alias) public view returns (string hash) {
    return aliasesMap[_alias].avatarHash;
}
*/