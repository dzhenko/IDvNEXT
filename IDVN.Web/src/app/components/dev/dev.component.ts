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

    public canClaimAliasForFree() {
        this.aliasesContract.canClaimAliasForFree().subscribe(r => {
            debugger;
        });
    }

    public claimAliasForFree() {
        this.aliasesContract.claimAliasForFree(this.alias).subscribe(r => {
            debugger;
        });
    }

    public claimAliasWithEth() {
        this.aliasesContract.claimAliasWithEth(this.alias).subscribe(r => {
            debugger;
        });
    }

    public claimAliasWithToken() {
        this.aliasesContract.claimAliasWithToken(this.alias).subscribe(r => {
            debugger;
        });
    }

    public releaseAlias() {
        this.aliasesContract.releaseAlias(this.alias).subscribe(r => {
            debugger;
        });
    }

    public claimedAliasesCount() {
        this.aliasesContract.getClaimedAliasesCount().subscribe(r => {
            debugger;
        });
    }

    public getClaimEthFeeAmount() {
        this.aliasesContract.getClaimEthFeeAmount().subscribe(r => {
            debugger;
        });
    }

    public getClaimTokenFeeAmount() {
        this.aliasesContract.getClaimTokenFeeAmount().subscribe(r => {
            debugger;
        });
    }

    public getClaimTokenAddress() {
        this.aliasesContract.getClaimTokenAddress().subscribe(r => {
            debugger;
        });
    }
}
