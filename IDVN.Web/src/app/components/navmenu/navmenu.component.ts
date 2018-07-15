import { Component, OnInit } from '@angular/core';

import {
    Web3Service,
    EthService
} from '../../services/index';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent implements OnInit {
    constructor(
        private web3Service: Web3Service) {
    }

    ngOnInit() {
        this.web3Service.walletAccount().subscribe(address => {
            this.imgUrl = EthService.generateAddressImageUrl(address);
            this.isLoggedIn = !!address;
            this.user = address;
        });
    }

    public imgUrl: string = null;
    public isLoggedIn: boolean = false;
    public user: string = null;
}
