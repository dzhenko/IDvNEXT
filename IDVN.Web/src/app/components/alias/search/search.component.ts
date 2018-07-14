import { Component, OnInit } from '@angular/core';

import {
    AliasesContractService,
    UtilsService
} from '../../../services/index';

@Component({
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchAliasComponent implements OnInit {
    constructor(private aliasesContract: AliasesContractService) {
        
    }

    public aliasToSearchFor: string = '';
    public hasResults: boolean = false;
    public aliasFree: boolean = false;
    public alternativeAliases: string[] = [];
    public aliasResult: string = '';
    public canClaimForFree: boolean = false;

    ngOnInit() {
        this.aliasesContract.canClaimAliasForFree().subscribe(r => this.canClaimForFree = r);
    }

    public search() {
        this.alternativeAliases = [];
        this.aliasesContract.isClaimedAlias(this.aliasToSearchFor).subscribe(r => {
            this.hasResults = true;
            this.aliasFree = !r;
            this.aliasResult = this.aliasToSearchFor;
            this.aliasToSearchFor = '';

            if (!this.aliasFree) {
                var variations = [
                    this.aliasResult + 1,
                    'the' + this.aliasResult,
                    'official' + this.aliasResult,
                    this.aliasResult + '_2',
                    this.aliasResult + UtilsService.random(1, 10000),
                ];

                UtilsService.observableFromObservables(variations.map(v => this.aliasesContract.isClaimedAlias(v))).subscribe(results => {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i]) {
                            this.alternativeAliases.push(variations[i]);
                        }
                    }
                });

                this.aliasesContract.areClaimedAliases(variations).subscribe(res => {
                    res.forEach((isClaimed, i) => {
                        if (!isClaimed) {
                            this.alternativeAliases.push(variations[i]);
                        }
                    });
                });
            }
        });
    }
}
