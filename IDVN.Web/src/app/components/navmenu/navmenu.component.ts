import { Component } from '@angular/core';

import {
    IdentityService,
    EthService
} from '../../services/index';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent{
    constructor(
        private identityService: IdentityService) {
    }

    public imgUrl = EthService.generateAddressImageUrl(this.identityService.getAddress());
    public isLoggedIn = this.identityService.isLoggedIn();
    public user = this.identityService.getAddress();
}
