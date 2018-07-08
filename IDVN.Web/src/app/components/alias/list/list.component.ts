import { Component, AfterViewInit } from '@angular/core';

import {
    AliasesContractService,
    NotificationsService
} from '../../../services/index';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListAliasComponent implements AfterViewInit {
    constructor(
        private aliasesContract: AliasesContractService) {
        
    }

    public aliases: string[] = [];

    ngAfterViewInit() {
        this.init();
    }

    public release(alias: string) {
        NotificationsService.confirm('Are you sure you want to release (remove) this alias?', () =>
            this.aliasesContract.releaseAlias(alias).subscribe(tx => {
                NotificationsService.successTx('You have succesfully created a transaction', [tx]);
                this.init();
            }));
    }

    private init() {
        this.aliasesContract.allAliases().subscribe(r => this.aliases = r);
    }
}
