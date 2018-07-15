import { Injectable } from '@angular/core';

import { Web3Service } from './web3.service';
import { Observable } from 'rxjs/Observable';

import { TokenContract } from './token.contract';

import { BaseInitableService } from '../base/base-initable.service';
import { LoggerService } from '../core/logger.service';
import { UtilsService } from '../core/utils.service';

@Injectable()
export class TokenContractService {
    constructor(
        private loggerService: LoggerService,
        private web3: Web3Service) {
    }

    private log(message: string, isError: boolean = false) {
        this.loggerService.debugOrError('[S]TOKENCONTRACT', message, isError);
    }
}
