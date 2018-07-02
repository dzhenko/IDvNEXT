import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    public getItem(key: string): string {
        return localStorage.getItem(key);
    }

    public getObject(key: string): any {
        const obj = localStorage.getItem(key);
        if (obj) {
            return JSON.parse(obj);
        }
    }

    public getBool(key: string): boolean {
        const val = localStorage.getItem(key);
        if (val && val.toUpperCase() === 'TRUE') {
            return true;
        }

        if (val && val.toUpperCase() === 'FALSE') {
            return false;
        }

        return null;
    }

    public getNumber(key: string): number {
        const val = localStorage.getItem(key);
        if (val) {
            return parseInt(val);
        }
    }

    public getArray(key: string) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    public setItem(key: string, data: any): void {
        if (data && typeof data !== 'string') {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            } else {
                data = data.toString();
            }
        }

        localStorage.setItem(key, data);
    }

    public removeItem(key: string): void {
        return localStorage.removeItem(key);
    }

    public removeAllWithKeyContaining(key: string, isCaseSensitive: boolean = true): void {
        if (!key) {
            return;
        }

        const length = localStorage.length;
        for (let i = 0; i < length; i += 1) {
            let currentKey = localStorage.key(0);
            if (!isCaseSensitive) {
                currentKey = currentKey.toLowerCase();
                key = key.toLowerCase();
            }

            if (currentKey.indexOf(key) >= 0) {
                localStorage.removeItem(currentKey);
            }
        }
    }

    public clear() {
        localStorage.clear();
    }
}
