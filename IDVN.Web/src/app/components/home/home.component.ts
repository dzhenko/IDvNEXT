import { Component, AfterViewInit } from '@angular/core';

import {
    AliasesContractService
} from '../../services/index';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
    constructor(private aliasesContract: AliasesContractService) {
        
    }

    public claimedAliasesCount: any = 'loading ..';

    ngAfterViewInit() {
        this.aliasesContract.claimedAliasesCount().subscribe(r => this.claimedAliasesCount = r);
    }
}
