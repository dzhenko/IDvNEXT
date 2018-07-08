import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    AliasesContractService,
    NotificationsService
} from '../../../services/index';

@Component({
    templateUrl: './claim.component.html',
    styleUrls: ['./claim.component.css']
})
export class ClaimAliasComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private aliasesContract: AliasesContractService) {
        
    }

    private activatedRouteSubscribtion: any = null;

    ngOnInit() {
        this.activatedRouteSubscribtion = this.activatedRoute.params.subscribe(params => this.aliasToClaim = params['id']);
    }

    ngOnDestroy() {
        if (this.activatedRouteSubscribtion) {
            this.activatedRouteSubscribtion.unsubscribe();
            this.activatedRouteSubscribtion = null;
        }
    }

    public aliasToClaim: string = '';

    public claim() {
        NotificationsService.confirm('Are you sure you want to claim this alias?', () => {
            this.aliasesContract.isClaimedAlias(this.aliasToClaim).subscribe(r => {
                if (r) {
                    NotificationsService.error('This alias is already claimed. Go to Search aliases to find an unclaimed one.');
                }
                else {
                    this.aliasesContract.claimAlias(this.aliasToClaim).subscribe(tx => {
                        NotificationsService.successTx('You have sent a transaction to claim your alias!. If it succeeds you will find your alias in List aliases.', [tx]);
                    });
                }
            });
        });
    }
}
