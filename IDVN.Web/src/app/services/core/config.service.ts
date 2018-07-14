import { Injectable } from '@angular/core';

import { Web3Service } from '../eth/web3.service';
import { AliasesContract } from '../eth/aliases.contract';
import { TokenContract } from '../eth/token.contract';
import { IDArtefactsContract } from '../eth/idartefacts.contract';

import { GANACHE_ACCOUNTS, ALIASES_CONTRACT_ADDRESS, IDVN_TOKEN_ADDRESS, IDARTEFACTS_CONTRACT_ADDRESS } from '../../app.constants';

@Injectable()
export class ConfigService {
    public static preInitFactory(cs: ConfigService, web3: Web3Service) {
        return () => cs.preInit(web3);
    }

    public preInit(web3: Web3Service): Promise<void> {
        // TEMP
        web3.unlockAccount(GANACHE_ACCOUNTS[0].pk);

        return Promise.all([
            this.ensureAliasesContractAndToken(web3),
            this.ensureIdArtefactsContract(web3)
        ]).then(() => { });
    }

    private ensureAliasesContractAndToken(web3: Web3Service): Promise<any> {
        if (ALIASES_CONTRACT_ADDRESS) {
            AliasesContract.Address = ALIASES_CONTRACT_ADDRESS;
            AliasesContract.Instance = web3.getContract(AliasesContract.ABI, AliasesContract.Address);
            return web3.readContractMethod(AliasesContract.Instance.methods.getClaimTokenAddress())
                .do(tokenAddress => {
                    TokenContract.Address = tokenAddress;
                    TokenContract.Instance = web3.getContract(TokenContract.ABI, TokenContract.Address);
                }).toPromise();
        }
        else if (IDVN_TOKEN_ADDRESS) {
            return web3.deployContract(AliasesContract.ABI, AliasesContract.DATA, GANACHE_ACCOUNTS[0].addr, AliasesContract.buildCtorArgs(GANACHE_ACCOUNTS[0].addr, IDVN_TOKEN_ADDRESS, 0, 0))
                .do(contractAddress => {
                    AliasesContract.Address = contractAddress;
                    AliasesContract.Instance = web3.getContract(AliasesContract.ABI, AliasesContract.Address);
                }).toPromise();
        }
        else {

        }
    }

    private ensureIdArtefactsContract(web3: Web3Service): Promise<any> {
        return Promise.resolve();
    }
}
