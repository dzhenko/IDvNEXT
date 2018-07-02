import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { StorageService } from './storage.service';
import { LoggerService } from './logger.service';
import { UtilsService } from './utils.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class IdentityService {
    private static readonly ADDRESS_KEY = 'ADDRESS_KEY';

    constructor(
        private loggerService: LoggerService,
        private storageService: StorageService) { }

    private address: string;
    private pwd: string;
    private pwdActiveTo: Date;
    private pwdCleanHandle: any;

    public tempToggleLogin() {
        if (this.address) {
            this.removeAddress();
        }
        else {
            this.setAddress('0x0000000000000000000000000000000000000000');
        }
    }

    public isLoggedIn(): boolean {
        return !!this.getAddress();
    }

    public getAddress() {
        if (!this.address) {
            const persistedDisplayName = this.storageService.getItem(IdentityService.ADDRESS_KEY);
            if (persistedDisplayName) {
                this.address = persistedDisplayName;
            }
        }

        return this.address;
    }

    public setAddress(address: string) {
        this.address = address.toLowerCase();
        this.storageService.setItem(IdentityService.ADDRESS_KEY, this.address);
        window.location.href = '/';
    }

    public removeAddress() {
        this.address = null;
        this.storageService.removeItem(IdentityService.ADDRESS_KEY);
        window.location.href = '/';
    }

    public getPk(): Observable<any> {
        // TODO: Dynamic?
        this.pwd = '0x01759e83dfae7067a1151233e52092e75b58b14e7fa5f92ddc5c999235d6ba48';
        return UtilsService.observableFrom(this.pwd);
    }

    public setPwd(pwd: string) {
        this.pwd = pwd;

        const activeTo = new Date();
        activeTo.setHours(activeTo.getHours() + 2);
        this.pwdActiveTo = activeTo;

        this.pwdCleanHandle = setTimeout(() => this.removePwd(), 1000 * 60 * 60 * 2); // 2 hours
    }

    public isUnlocked(): boolean {
        if (this.pwd) {
            if (this.pwdActiveTo < new Date()) {
                this.removePwd();
            }
            else {
                return true;
            }
        }

        return false;
    }

    public getPwd(): Observable<string> {
        if (this.isUnlocked()) {
            return UtilsService.observableFrom(this.pwd);
        }
        else {
            return this.promptPwd().catch(() => {
                NotificationsService.error('Invalid password');
                return this.promptPwd();
            });
        }
    }

    public promptPwd(): Observable<string> {
        return UtilsService.observableFromCb(done => NotificationsService.prompt(
            null,
            'Please input your password',
            (val) => {
                if (this.validatePwd(val)) {
                    this.setPwd(val);
                    done(true, val);
                }
                else {
                    done(false, null);
                }
            },
            null,
            (val) => {
                if (!val) {
                    return 'Password is required';
                }
            },
            'password',
            'Password'));
    }

    public removeAll() {
        this.removePwd();
        this.removeAddress();
    }

    public withPasswordCb(cb: (pwd: string) => any): Observable<any> {
        return UtilsService.observableFromCb(done => {
            this.getPwd().subscribe(pwd => {
                done(true, cb(pwd));
            });
        });
    }

    public withPasswordObs(obs: (pwd: string) => Observable<any>): Observable<any> {
        return UtilsService.observableFromCb(done => {
            this.getPwd().subscribe(pwd => {
                obs(pwd).subscribe(r => {
                    done(true, r);
                });
            });
        });
    }

    private removePwd() {
        if (this.pwdCleanHandle) {
            clearTimeout(this.pwdCleanHandle);
        }

        this.pwd = null;
        this.pwdActiveTo = null;
        this.pwdCleanHandle = null;
    }

    private validatePwd(pwd: string): boolean {
        // TODO: Is this possible? Try to sign something and validate ?
        return !!pwd;
    }

    private log(message: string, isError: boolean = false) {
        this.loggerService.debugOrError('[S]IDENTITY', message, isError);
    }
}
