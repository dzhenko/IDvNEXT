// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    apiUrl: '/',
    nodeUrl: 'http://127.0.0.1:7545',
    alliasesContractAddress: '0x097B007d1A60aB5b0E25Fc94CA8C50c59A5e4333',
    IDVNTokenContractAddress: '0x0732aA20dc9AA6407ABF2bbc3212B5372b392364',

    deployerAccountAddress: '0xB91E832fb9Ce622f6e0Ce1e54e411C12F75fBa6A',
    deployerAccountPk: '89a8a4fcc4ff37cd6200a2d6969c4296d45bbffd96e9f1bf2082e3f1d05b4dfb'
};
