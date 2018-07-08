import { Component } from '@angular/core';

import {
    AliasesContractService
} from '../../../services/index';

@Component({
    templateUrl: './claim.component.html',
    styleUrls: ['./claim.component.css']
})
export class ClaimAliasComponent {
    constructor(private aliasesContract: AliasesContractService) {
        
    }
}
