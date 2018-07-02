import { Injectable } from '@angular/core';

import { BaseInitableService } from '../base/base-initable.service';

import { UtilsService } from './utils.service';
import { LoggerService } from './logger.service';

@Injectable()
export class AppService extends BaseInitableService {
    constructor(
        private loggerService: LoggerService) {

        super();
    }

    protected initImpl() {
        const initSubscriptions = [
        ];

        return UtilsService.observableFromCb(done => {
            this.initSubscriptionBatch(initSubscriptions, 0, () => done(true));
        });
    }

    protected stopImpl() {
        const stopSubscriptions = [
        ];

        return UtilsService.observableFromObservables(stopSubscriptions);
    }

    protected log(message: string, isError: boolean = false) {
        this.loggerService.debugOrError('[S]APP', message, isError);
    }

    private initSubscriptionBatch(initSubscriptions: Array<Array<BaseInitableService>>, index: number, doneCb: any) {
        const batch = initSubscriptions.map(s => s[index]).filter(e => !!e);
        if (batch.length) {
            this.log('initializing batch ' + index);
            UtilsService.observableFromObservables(batch.map(s => s.init())).subscribe(
                () => this.initSubscriptionBatch(initSubscriptions, index + 1, doneCb));
        } else {
            this.log('initializing done');
            doneCb();
        }
    }
}
