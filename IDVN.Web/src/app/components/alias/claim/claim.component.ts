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

    public aliasToClaim: string = '';
    public canClaimForFree: boolean = false;
    public isLoading: boolean = false;

    private activatedRouteSubscribtion: any = null;

    ngOnInit() {
        this.activatedRouteSubscribtion = this.activatedRoute.params.subscribe(params => {
            this.aliasToClaim = params['alias'];
        });

        this.aliasesContract.canClaimAliasForFree().subscribe(r => this.canClaimForFree = r);
    }

    ngOnDestroy() {
        if (this.activatedRouteSubscribtion) {
            this.activatedRouteSubscribtion.unsubscribe();
            this.activatedRouteSubscribtion = null;
        }
    }

    public claimForFree() {
        this.isLoading = true;
        this.aliasesContract.canClaimAliasForFree().subscribe(canClaimFree => {
            if (canClaimFree) {
                NotificationsService.confirm('Are you sure you want to claim this alias?', () => {
                    this.aliasesContract.isClaimedAlias(this.aliasToClaim).subscribe(r => {
                        if (r) {
                            this.isLoading = false;
                            NotificationsService.error('This alias is already claimed. Go to Search aliases to find an unclaimed one.');
                        }
                        else {
                            this.aliasesContract.claimAliasForFree(this.aliasToClaim).subscribe(tx => {
                                this.isLoading = false;
                                this.aliasToClaim = '';
                                NotificationsService.successTx('You have sent a transaction to claim your alias!. If it succeeds you will find your alias in View aliases.', [tx]);
                            });
                        }
                    });
                }, () => this.isLoading = false);
            }
            else {
                this.isLoading = false;
                NotificationsService.error('You can not claim aliases for free.');
            }
        });
    }

    public claimWithEth() {
        this.isLoading = true;
        this.aliasesContract.getClaimEthFeeAmount().subscribe(fee => {
            NotificationsService.confirm('Are you sure you want to claim this alias with ETH? Current ETH fee is ' + fee, () => {
                this.aliasesContract.isClaimedAlias(this.aliasToClaim).subscribe(r => {
                    if (r) {
                        this.isLoading = false;
                        NotificationsService.error('This alias is already claimed. Go to Search aliases to find an unclaimed one.');
                    }
                    else {
                        this.aliasesContract.claimAliasWithEth(this.aliasToClaim).subscribe(tx => {
                            this.isLoading = false;
                            this.aliasToClaim = '';
                            NotificationsService.successTx('You have sent a transaction to claim your alias!. If it succeeds you will find your alias in View aliases.', [tx]);
                        });
                    }
                });
            }, () => this.isLoading = false);
        });
    }

    public claimWithToken() {
        this.isLoading = true;
        this.aliasesContract.getClaimTokenFeeAmount().subscribe(fee => {
            NotificationsService.confirm('Are you sure you want to claim this alias with IDVN Tokens? Current token fee is ' + fee, () => {
                this.aliasesContract.isClaimedAlias(this.aliasToClaim).subscribe(r => {
                    if (r) {
                        this.isLoading = false;
                        NotificationsService.error('This alias is already claimed. Go to Search aliases to find an unclaimed one.');
                    }
                    else {
                        this.aliasesContract.claimAliasWithToken(this.aliasToClaim).subscribe(tx => {
                            this.isLoading = false;
                            this.aliasToClaim = '';
                            NotificationsService.successTx('You have sent a transaction to claim your alias!. If it succeeds you will find your alias in View aliases.', [tx]);
                        });
                    }
                });
            }, () => this.isLoading = false);
        });
    }
}
