let tokenContractInstance = null;

module.exports = {
    al1: 'john@main.eth',
    al2: 'david@main.eth',
    al3: 'mike@main.eth',

    emptyAddress: '0x0000000000000000000000000000000000000000',

    fee: 5,

    isRevert: ex => ex && /revert/.test(ex.message),

    getTokenInstance: async artefacts => {
        if (tokenInstance) {
            return tokenInstance;
        }

        const TokenContract = artifacts.require("IDVNToken");
        tokenInstance = await TokenContract.new();
        tokenAddress = instance.address;
        return tokenInstance;
    }
};