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

    public update(alias: string, file: File) {
        this.aliasesService.
        this.execute(ipfs => ipfs.update(file)).subscribe(r => {
            debugger;
        });
    }

    public read(name: string) {
        this.execute(ipfs => ipfs.read(name));
    }

    private execute(cb: (ifps: any) => Observable<any>) {
        return this.client.isInitialized().flatMap(clientInited => {
            if (clientInited) {
                return cb(this.client);
            } else {
                return this.server.isInitialized().flatMap(serverInitialized => {
                    if (serverInitialized) {
                        return cb(this.server);
                    }
                    else {
                        return Observable.empty();
                    }
                });
            }
        });
    }
}
