import { Component, AfterViewInit } from '@angular/core';

import {
    AliasesContractService,
    NotificationsService,
    IPFSService
} from '../../../services/index';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListAliasComponent implements AfterViewInit {
    constructor(
        private aliasesContract: AliasesContractService,
        private iPFSService: IPFSService) { }

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

    public view(alias: string) {
        this.aliasesContract.readAvatarHash(alias).subscribe(hash => {
            if (hash) {
                window.open('https://ipfs.io/ipfs/' + hash, '_blank');
            }
        });
    }

    public onFileChange() {
        if (!arguments || !arguments.length) {
            return;
        }

        var event = arguments[0];
        if (!event || !event.target || !event.target.files || !event.target.files.length || !event.target.files[0]) {
            return;
        }

        var file = event.target.files[0];
        var alias = arguments[1];
        if (!alias) {
            return;
        }

        NotificationsService.confirm('Are you sure you want to update the avatar for alias ' + alias + ' ?', () => {
            this.iPFSService.update(alias, file).subscribe(tx => {
                NotificationsService.successTx('You have sent a transaction to update your avatar!. If it succeeds you will be able to view your alias avatar.', [tx]);
            });
        });
    }

    private init() {
        this.aliasesContract.allAliases().subscribe(r => this.aliases = r);
    }
}
