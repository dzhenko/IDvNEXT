import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Web3Service } from '../eth/web3.service';
import { AliasesContract } from '../eth/aliases.contract';
import { TokenContract } from '../eth/token.contract';

import { environment } from '../../../environments/environment';

@Injectable()
export class ConfigService {
    public static preInitFactory(cs: ConfigService, web3: Web3Service) {
        return () => cs.preInit(web3);
    }

    public preInit(web3: Web3Service): Promise<void> {
        return Promise.all([
            this.ensureAliasesContractAndToken(web3).toPromise()
        ]).then(() => { });
    }

    private ensureAliasesContractAndToken(web3: Web3Service): Observable<any> {
        console.log('Ensuring Aliases contract and token START');

        if (environment.alliasesContractAddress) {
            console.log('Aliases contract ADDRESS - getting instance -> ' + environment.alliasesContractAddress);

            AliasesContract.Address = environment.alliasesContractAddress;
            AliasesContract.Instance = web3.getContract(AliasesContract.ABI, AliasesContract.Address);
            return web3.readContractMethod(AliasesContract.Instance.methods.claimTokenAddress())
                .do(tokenAddress => {
                    console.log('Token contract getting instance from aliases token property -> ' + tokenAddress);

                    TokenContract.Address = tokenAddress;
                    TokenContract.Instance = web3.getContract(TokenContract.ABI, TokenContract.Address);

                    console.log('Ensuring Aliases contract and token DONE');
                });
        }
        else if (environment.IDVNTokenContractAddress) {
            console.log('Aliases contract NO address');
            console.log('Token contract ADDRESS - getting instance -> ' + environment.IDVNTokenContractAddress);

            TokenContract.Address = environment.IDVNTokenContractAddress;
            TokenContract.Instance = web3.getContract(TokenContract.ABI, TokenContract.Address);

            return web3.deployContract(AliasesContract.ABI, AliasesContract.DATA, environment.deployerAccountAddress, AliasesContract.buildCtorArgs(environment.deployerAccountAddress, TokenContract.Address, 0, 0))
                .do(contractAddress => {
                    console.log('Aliases contract DEPLOYED - getting instance -> ' + contractAddress);

                    AliasesContract.Address = contractAddress;
                    AliasesContract.Instance = web3.getContract(AliasesContract.ABI, AliasesContract.Address);

                    console.log('Ensuring Aliases contract and token DONE');
                });
        }
        else {
            console.log('Aliases contract NO address');
            console.log('Token contract NO address');
            return web3.deployContract(TokenContract.ABI, TokenContract.DATA, environment.deployerAccountAddress).flatMap(tokenAddress => {
                console.log('Token contract DEPLOYED - getting instance -> ' + tokenAddress);
                TokenContract.Address = tokenAddress;
                TokenContract.Instance = web3.getContract(TokenContract.ABI, TokenContract.Address);
                return web3.deployContract(AliasesContract.ABI, AliasesContract.DATA, environment.deployerAccountAddress, AliasesContract.buildCtorArgs(environment.deployerAccountAddress, TokenContract.Address, 0, 0)).do(contractAddress => {
                    console.log('Aliases contract DEPLOYED - getting instance -> ' + contractAddress);

                    AliasesContract.Address = contractAddress;
                    AliasesContract.Instance = web3.getContract(AliasesContract.ABI, AliasesContract.Address);

                    console.log('Ensuring Aliases contract and token DONE');
                });
            });
        }
    }
}
