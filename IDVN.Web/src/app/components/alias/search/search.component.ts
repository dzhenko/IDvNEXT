import { Component } from '@angular/core';

import {
    AliasesContractService
} from '../../../services/index';

@Component({
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchAliasComponent {
    constructor(private aliasesContract: AliasesContractService) {
        
    }
}
