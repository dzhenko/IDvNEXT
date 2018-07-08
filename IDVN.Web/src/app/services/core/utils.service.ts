import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class UtilsService {
    public static mergeObjects(source: any, destination: any, properties: string[] = null): any {
        if (source && destination) {
            if (!properties || !properties.length) {
                properties = Object.getOwnPropertyNames(source);
            }

            properties.forEach(prop => destination[prop] = source[prop]);
        }

        return destination;
    }

    public static concatObjects(source: any, destination: any, sourcePropName: string, destinationPropName: string): any {
        if (!source || !destination) {
            return source || destination;
        }

        const res = {};
        Object.getOwnPropertyNames(source).forEach(k => {
            if (destination[k]) {
                res[k] = {};
                res[k][sourcePropName] = source[k];
                res[k][destinationPropName] = destination[k];
            }
        });

        return res;
    }

    public static generateNonce(): string {
        return new Date().getTime() + Math.random().toFixed(19).toString().substring(2);
    }

    public static arrayFromObject(obj: any, skippedProps: string[] = null): any[] {
        if (obj) {
            if (skippedProps && skippedProps.length) {
                return Object.getOwnPropertyNames(obj).filter(prop => skippedProps.indexOf(prop) < 0).map(p => obj[p]);
            }
            else {
                return Object.getOwnPropertyNames(obj).map(p => obj[p]);
            }
        }
    }

    public static objectAny(obj: any, cb: (obj: any) => boolean): boolean {
        return !!UtilsService.objectFirst(obj, cb);
    }

    public static objectFirst(obj: any, cb: (obj: any) => boolean): any {
        if (obj && cb) {
            for (const k in obj) {
                if (obj.hasOwnProperty(k)) {
                    if (cb(obj[k])) {
                        return obj[k];
                    }
                }
            }
        }
    }

    public static objectWhere(obj: any, cb: (obj: any) => boolean): any {
        const result = [];

        if (obj && cb) {
            for (const k in obj) {
                if (obj.hasOwnProperty(k)) {
                    if (cb(obj[k])) {
                        result.push(obj[k]);
                    }
                }
            }
        }

        return result;
    }

    public static objectGroup(obj: any, cbKeyExtraction: (obj: any) => any): any {
        const result = {};

        if (obj && cbKeyExtraction) {
            for (const k in obj) {
                if (obj.hasOwnProperty(k)) {
                    const key = cbKeyExtraction(obj[k]);
                    if (!result[key]) {
                        result[key] = [];
                    }

                    result[key].push(obj[k]);
                }
            }
        }

        return result;
    }

    public static objectMap(obj: any, cb: (key: any, val: any) => any): any {
        return Object.getOwnPropertyNames(obj).map(p => cb(p, obj[p]));
    }

    public static objectFromArrayKeysOnly(arr: any[], keyProperty: any): any {
        const result = {};

        if (arr) {
            arr.forEach(item => result[item[keyProperty]] = true);
        }

        return result;
    }

    public static objectFromArray(arr: any[], keyProperty: any = 'id', valueProperty: any = null): any {
        const result = {};

        if (arr) {
            if (valueProperty) {
                arr.forEach(item => {
                    if (item) {
                        result[item[keyProperty]] = item[valueProperty];
                    }
                });
            }
            else {
                arr.forEach(item => {
                    if (item) {
                        result[item[keyProperty]] = item;
                    }
                });
            }
        }

        return result;
    }

    public static objectFromArrayKeyFunc(arr: any[], keyCb: (obj: any) => string, valueProperty: any = null): any {
        const result = {};

        if (arr) {
            if (valueProperty) {
                arr.forEach(item => {
                    if (item) {
                        result[keyCb(item)] = item[valueProperty];
                    }
                });
            }
            else {
                arr.forEach(item => {
                    if (item) {
                        result[keyCb(item)] = item;
                    }
                });
            }
        }

        return result;
    }

    public static valuesCount(obj: any, valueValue: any): number {
        let count = 0;

        if (obj) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] === valueValue) {
                        count++;
                    }
                }
            }
        }

        return count;
    }

    public static arrayFirst(arr: any[], cb: (obj: any) => boolean): any {
        if (arr && cb) {
            for (let i = 0; i < arr.length; i++) {
                if (cb(arr[i])) {
                    return arr[i];
                }
            }
        }
    }

    public static arrayDistinct(arr: any[]): any[] {
        if (!arr || !arr.length) {
            return arr;
        }

        var result = {};
        arr.forEach(e => result[e] = true);
        return Object.getOwnPropertyNames(result);
    }

    public static arrayAny(arr: any[], cb: (obj: any) => boolean): boolean {
        return !!UtilsService.arrayFirst(arr, cb);
    }

    public static arrayIndexOf(arr: any[], cb: (obj: any) => boolean): any {
        if (arr && cb) {
            for (let i = 0; i < arr.length; i++) {
                if (cb(arr[i])) {
                    return i;
                }
            }
        }
    }

    public static maxFromArray(arr: any[], key: any): any {
        if (arr) {
            let max = key ? arr[0][key] : arr[0];

            arr.forEach(el => {
                if (key && el[key] > max) {
                    max = el[key];
                }
                else if (!key && el > max) {
                    max = el;
                }
            });

            return max;
        }
    }

    public static formatPercentage(value: number, total: number): string {
        const percentage = ((total ? (value / total) : 0) * 100).toFixed(2);

        if (percentage[0] === '0') {
            return percentage.substr(1);
        }

        return percentage;
    }

    public static observableFromCb(callback: (done: (success: boolean, payload?: any) => any) => any): Observable<any> {
        return Observable.create((observer) => {
            callback((success, payload) => {
                if (success) {
                    observer.next(payload);
                    observer.complete();
                }
                else {
                    observer.error(payload);
                }
            });
        });
    }

    public static observableFromEmpty(): Observable<any> {
        return Observable.of(null);
    }

    public static observableFrom(obj): Observable<any> {
        return Observable.of(obj);
    }

    public static observableFromObservables(observables): Observable<any> {
        return Observable.forkJoin(observables);
    }

    public static observableFromPromise(pr: Promise<any>) {
        return Observable.fromPromise(pr);
    }

    public static copyToClipboard(val: string) {
        const el = $('<input />').val(val);
        $('body').append(el);
        (el[0] as any).select();
        document.execCommand('Copy');
        el.remove();
    }

    public static trimLeft(val: string, char: string = ' '): string {
        if (val) {
            while (val[0] === char) {
                val = val.substring(1);
            }
        }

        return val;
    }

    public static trimRight(val: string, char: string = ' '): string {
        if (val) {
            while (val[val.length - 1] === char) {
                val = val.substring(0, val.length - 1);
            }
        }

        return val;
    }

    public static random(from: number, to: number) {
        return Math.floor(Math.random() * (to - from)) + from;
    }
}
