import { Injectable } from '@angular/core';

import { Web3Service } from './web3.service';
import { Observable } from 'rxjs/Observable';


import { AliasesContract } from './aliases.contract';

import { BaseInitableService } from '../base/base-initable.service';
import { LoggerService } from '../core/logger.service';
import { UtilsService } from '../core/utils.service';
import { IdentityService } from '../core/identity.service';

@Injectable()
export class AliasesContractService {
    constructor(
        private loggerService: LoggerService,
        private identityService: IdentityService,
        private web3: Web3Service) {
    }

    public isClaimedAlias(alias: string): Observable<boolean> {
        return this.web3.readContractMethod(AliasesContract.Instance.methods.isClaimedAlias(alias))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public areClaimedAliases(aliases: string[]): Observable<boolean[]> {
        return this.web3.readContractMethods(aliases.map(a => AliasesContract.Instance.methods.isClaimedAlias(a)))
            .map(resArr => resArr.map(el => !el.err && el.res))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public aliasToAddress(alias: string): Observable<string> {
        return this.web3.readContractMethod(AliasesContract.Instance.methods.aliasToAddress(alias)).map(r => {
            debugger;

            return null;
        }).catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public allAliases(): Observable<string[]> {
        return this.web3.readContractMethod(AliasesContract.Instance.methods.aliasesCount(), this.identityService.getAddress()).flatMap(r => {
            const aliasesObs = [];

            if (r && !isNaN(r)) {
                const count = parseInt(r);
                for (var i = 0; i < count; i++) {
                    aliasesObs.push(this.web3.readContractMethod(AliasesContract.Instance.methods.aliasAtIndex(i), this.identityService.getAddress()));
                }
            }

            return Observable.forkJoin(aliasesObs).map(arr => UtilsService.arrayDistinct(arr));
        }).catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public claimAlias(alias: string): Observable<string> {
        return this.web3.writeContractMethod(AliasesContract.Instance.methods.claimAlias(alias), this.identityService.getAddress()).map(r => r.transactionHash)
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public releaseAlias(alias: string): Observable<string> {
        return this.web3.writeContractMethod(AliasesContract.Instance.methods.releaseAlias(alias), this.identityService.getAddress()).map(r => r.transactionHash)
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    public claimedAliasesCount(): Observable<number> {
        return this.web3.readContractMethod(AliasesContract.Instance.methods.claimedAliasesCount()).map(r => r && !isNaN(r) && +parseInt(r))
            .catch(err => this.log(err, true) || UtilsService.observableFromEmpty());
    }

    private log(message: string, isError: boolean = false) {
        this.loggerService.debugOrError('[S]ALIASESCONTRACT', message, isError);
    }
}
