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

    public avatarFileName: string = null;
    public avatarFile: any = null;

    ngAfterViewInit() {
        this.aliasesContract.canClaimAliasForFree().subscribe(r => this.canClaimForFree = r);
        this.aliasesContract.getClaimedAliasesCount().subscribe(r => this.claimedAliasesCount = r);
    }

    onFileChange(event) {
        if (event.target.files && event.target.files.length) {
            this.avatarFile = event.target.files[0];
        }
    }

    public update() {
        this.iPFSService.update(this.avatarFile);
    }

    public read() {
        this.iPFSService.read(this.avatarFileName);
    }
}
