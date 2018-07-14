import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IPFSDataService } from '../data/ipfs.data.service';
import { IPFSClientService } from './ipfs.client.service';
import { AliasesContractService } from '../eth/aliases.contract.service';

@Injectable()
export class IPFSService {
    constructor(
        private client: IPFSClientService,
        private server: IPFSDataService,
        private aliasesService: AliasesContractService) { }

    public update(alias: string, file: File): Observable<string> {
        if (!alias || !file) {
            return Observable.empty();
        }

        var updateFunc = this.client.initialized ? this.client.update : (this.server.initialized ? this.server.update : null);
        if (!updateFunc) {
            return;
        }

        return this.aliasesService.isOwnAlias(alias).flatMap(isOwnAlias => {
            if (!isOwnAlias) {
                return Observable.empty();
            }

            if (this.client.initialized) {
                return this.client.update(file).flatMap(hash => {
                    return this.aliasesService.updateAvatarHash(alias, hash);
                });
            }
            else if (this.server.initialized) {
                return this.server.update(file).flatMap(hash => {
                    return this.aliasesService.updateAvatarHash(alias, hash);
                });
            }
            else {
                return Observable.empty();
            }
        });
    }
}
