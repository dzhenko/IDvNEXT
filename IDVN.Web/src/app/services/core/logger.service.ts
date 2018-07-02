import { Injectable } from '@angular/core';

import { DateTimeService } from './datetime.service';

@Injectable()
export class LoggerService {
    // public log(message: any): void {
    //     console.log(this.format(message));
    // }
    // 
    // public logWithColor(message: any, color: string = '#3F73F8') {
    //     console.log('%c' + this.format(message), 'color:' + color + ';');
    // }

    public debug(message: any): void {
        console.log(this.format(message));
    }

    public debugWithColor(message: any, color: string = '#3F73F8') {
        console.log('%c' + this.format(message), 'color:' + color + ';');
    }

    public error(message: any): void {
        console.warn(this.format(message));
    }

    public debugOrError(logger: string, message: string, isError: boolean = false) {
        this[isError ? 'error' : 'debug'](logger + ' # ' + message);
    }

    private format(message: any): string {
        const date = DateTimeService.convertToUtcDate(new Date());
        let time = DateTimeService.formatTimeFromDate(date, true);
        time = time.substring(0, time.length - 3); // Remove _AM/_PM
        let ms = date.getMilliseconds().toString();
        if (ms.length === 2) {
            ms = '0' + ms;
        }
        else if (ms.length === 1) {
            ms = '00' + ms;
        }

        return `[${time}.${ms}] ${message}`;
    }
}
