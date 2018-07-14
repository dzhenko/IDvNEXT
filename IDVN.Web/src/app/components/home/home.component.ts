import { Component, AfterViewInit } from '@angular/core';

import {
    AliasesContractService,
    IPFSService
} from '../../services/index';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
    constructor(
        private aliasesContract: AliasesContractService,
        private iPFSService: IPFSService) { }

    public claimedAliasesCount: any = 'loading ..';
    public canClaimForFree: boolean = false;

    ngAfterViewInit() {
        this.aliasesContract.canClaimAliasForFree().subscribe(r => this.canClaimForFree = r);
        this.aliasesContract.getClaimedAliasesCount().subscribe(r => this.claimedAliasesCount = r);
    }
}
