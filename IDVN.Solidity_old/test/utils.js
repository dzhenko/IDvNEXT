module.exports = {
    al1: 'john@main.eth',
    al2: 'david@main.eth',
    al3: 'mike@main.eth',

    emptyAddress: '0x0000000000000000000000000000000000000000',
    
    ownerAddress = '0x1234567890123456789012345678901234567890',
    tokenAddress = '0x1111111111111111111111111111111111111111',

    isRevert: ex => ex && /revert/.test(ex.message)
};