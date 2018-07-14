let tokenAddress = null;

module.exports = {
    al1: 'john@main.eth',
    al2: 'david@main.eth',
    al3: 'mike@main.eth',

    emptyAddress: '0x0000000000000000000000000000000000000000',

    isRevert: ex => ex && /revert/.test(ex.message),

    getTokenAddress: async artefacts => {
        if (tokenAddress) {
            return tokenAddress;
        }

        const TokenContract = artifacts.require("IDVNToken");
        instance = await TokenContract.new();
        tokenAddress = instance.address;
        return tokenAddress;
    }
};