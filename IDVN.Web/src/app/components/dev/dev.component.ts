import { Component } from '@angular/core';

import {
    AliasesContractService
} from '../../services/index';

@Component({
    templateUrl: './dev.component.html',
    styleUrls: ['./dev.component.css']
})
export class DevComponent {
    constructor(private aliasesContract: AliasesContractService) {
        
    }

    public alias: string = null;

    public isClaimedAlias() {
        this.aliasesContract.isClaimedAlias(this.alias).subscribe(r => {
            debugger;
        });
    }

    public aliasToAddress() {
        this.aliasesContract.aliasToAddress(this.alias).subscribe(r => {
            debugger;
        });
    }

    public allAliases() {
        this.aliasesContract.allAliases().subscribe(r => {
            debugger;
        });
    }

    public claimAlias() {
        this.aliasesContract.claimAlias(this.alias).subscribe(r => {
            debugger;
        });
    }

    public releaseAlias() {
        this.aliasesContract.releaseAlias(this.alias).subscribe(r => {
            debugger;
        });
    }

    public claimedAliasesCount() {
        this.aliasesContract.claimedAliasesCount().subscribe(r => {
            debugger;
        });
    }
}
