import { Injectable } from '@angular/core';

import { Web3Service } from '../eth/web3.service';
import { AliasesContract } from '../eth/aliases.contract';

import { GANACHE_ACCOUNTS, ALIASES_CONTRACT_ADDRESS } from '../../app.constants';

@Injectable()
export class ConfigService {
    public static preInitFactory(cs: ConfigService, web3: Web3Service) {
        return () => cs.preInit(web3);
    }

    public preInit(web3: Web3Service): Promise<void> {
        web3.unlockAccount(GANACHE_ACCOUNTS[0].pk);
        if (ALIASES_CONTRACT_ADDRESS) {
            AliasesContract.Address = ALIASES_CONTRACT_ADDRESS;
            AliasesContract.Instance = web3.getContract(AliasesContract.ABI, AliasesContract.Address);
            return Promise.resolve();
        }
        else {
            return web3.deployContract(AliasesContract.ABI, AliasesContract.DATA, GANACHE_ACCOUNTS[0].addr)
                .toPromise()
                .then(r => {
                    AliasesContract.Address = r;
                    AliasesContract.Instance = web3.getContract(AliasesContract.ABI, AliasesContract.Address);
                })
                .then(() => { });
        }
    }
}
