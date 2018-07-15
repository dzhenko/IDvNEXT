import { Injectable } from '@angular/core';

import { Web3Service } from './web3.service';
import { Observable } from 'rxjs/Observable';

import { AliasesContract } from './aliases.contract';
import { TokenContract } from './token.contract';

import { BaseInitableService } from '../base/base-initable.service';
import { LoggerService } from '../core/logger.service';
import { UtilsService } from '../core/utils.service';
import { EthService } from './eth.service';

@Injectable()
export class AliasesContractService {
    constructor(
        private loggerService: LoggerService,
        private web3: Web3Service) {
    }

    public isClaimedAlias(alias: string): Observable<boolean> {
        if (!alias) {
            return UtilsService.observableFromEmpty();
        }

        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.isClaimedAlias(alias))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public isOwnAlias(alias: string): Observable<boolean> {
        if (!alias) {
            return UtilsService.observableFromEmpty();
        }

        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.isOwnAlias(alias))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public updateAvatarHash(alias: string, hash: string): Observable<string> {
        if (!alias || !hash) {
            return UtilsService.observableFromEmpty();
        }

        return this.web3
            .writeContractMethod(AliasesContract.Instance.methods.updateAvatarHash(alias, hash))
            .map(r => r.transactionHash)
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public readAvatarHash(alias: string): Observable<string> {
        if (!alias) {
            return UtilsService.observableFromEmpty();
        }

        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.readAvatarHash(alias))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public areClaimedAliases(aliases: string[]): Observable<boolean[]> {
        if (!aliases || !aliases.length || UtilsService.arrayAny(aliases, a => !!a)) {
            return UtilsService.observableFrom(aliases.map(() => false));
        }

        return this.web3
            .readContractMethods(aliases.map(a => AliasesContract.Instance.methods.isClaimedAlias(a)))
            .map(resArr => resArr.map(el => !el.err && el.res))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public aliasToAddress(alias: string): Observable<string> {
        if (!alias) {
            return UtilsService.observableFromEmpty();
        }

        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.aliasToAddress(alias))
            .map(r => r && (EthService.isEmptyAddress(r) ? '' : r))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public allAliases(): Observable<string[]> {
        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.aliasesCount())
            .flatMap(r => {
                const aliasesObs = [];

                if (r && !isNaN(r)) {
                    const count = parseInt(r);
                    for (var i = 0; i < count; i++) {
                        aliasesObs.push(this.web3.readContractMethod(AliasesContract.Instance.methods.aliasAtIndex(i)));
                    }
                }

                return Observable.forkJoin(aliasesObs).map(arr => UtilsService.arrayDistinct(arr).filter(a => !!a));
            })
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public claimAliasForFree(alias: string): Observable<string> {
        if (!alias) {
            return UtilsService.observableFromEmpty();
        }

        return Observable
            .forkJoin([
                this.getClaimEthFeeAmount(),
                this.getClaimTokenFeeAmount()
            ])
            .flatMap(resArr => {
                if (resArr[0] === 0) {
                    // Claim with eth
                    return this.claimAliasWithEth(alias);
                }
                else if (resArr[1] === 0) {
                    // Claim with token
                    return this.claimAliasWithToken(alias);
                }
                else {
                    return Observable.throw('You can not claim alias for free');
                }
            })
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public claimAliasWithEth(alias: string): Observable<string> {
        if (!alias) {
            return UtilsService.observableFromEmpty();
        }

        return this.web3
            .writeContractMethod(AliasesContract.Instance.methods.claimAliasWithEth(alias))
            .map(r => r.transactionHash)
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public claimAliasWithToken(alias: string): Observable<string> {
        if (!alias) {
            return UtilsService.observableFromEmpty();
        }

        // CALL APPROVE!
        return this.web3
            .writeContractMethod(AliasesContract.Instance.methods.claimAliasWithToken(alias))
            .map(r => r.transactionHash)
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public releaseAlias(alias: string): Observable<string> {
        if (!alias) {
            return UtilsService.observableFromEmpty();
        }

        return this.web3
            .writeContractMethod(AliasesContract.Instance.methods.releaseAlias(alias))
            .map(r => r.transactionHash)
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public getClaimedAliasesCount(): Observable<number> {
        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.claimedAliasesCount())
            .map(r => r && !isNaN(r) && +parseInt(r))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public canClaimAliasForFree(): Observable<boolean> {
        return this.web3
            .readContractMethods([
                AliasesContract.Instance.methods.claimEthFeeAmount(),
                AliasesContract.Instance.methods.claimTokenFeeAmount()
            ])
            .map(resArr => UtilsService.arrayAny(resArr, el => !el.err && +parseInt(el.res) === 0))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public getClaimEthFeeAmount(): Observable<number> {
        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.claimEthFeeAmount())
            .map(r => r && !isNaN(r) && +parseInt(r) / Math.pow(10, TokenContract.Decimals))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public getClaimTokenFeeAmount(): Observable<number> {
        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.claimTokenFeeAmount())
            .map(r => r && !isNaN(r) && +parseInt(r) / Math.pow(10, TokenContract.Decimals))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public getClaimTokenAddress(): Observable<string> {
        return this.web3
            .readContractMethod(AliasesContract.Instance.methods.claimTokenAddress())
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    private log(message: string, isError: boolean = false) {
        this.loggerService.debugOrError('[S]ALIASESCONTRACT', message, isError);
    }
}
