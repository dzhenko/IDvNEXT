import { Component } from '@angular/core';

import {
    AliasesContractService,
    UtilsService
} from '../../../services/index';

@Component({
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchAliasComponent {
    constructor(private aliasesContract: AliasesContractService) {
        
    }

    public aliasToSearchFor: string = '';
    public hasResults: boolean = false;
    public aliasFree: boolean = false;
    public alternativeAliases: string[] = [];

    public search() {
        this.alternativeAliases = [];
        this.aliasesContract.isClaimedAlias(this.aliasToSearchFor).subscribe(r => {
            this.hasResults = true;
            this.aliasFree = !r;
            if (!this.aliasFree) {
                var variations = [
                    this.aliasToSearchFor + UtilsService.random(1, 10000),
                    this.aliasToSearchFor + UtilsService.random(1, 10000),
                    this.aliasToSearchFor + UtilsService.random(1, 10000)
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
