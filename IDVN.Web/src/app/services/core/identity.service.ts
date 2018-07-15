//import { Injectable } from '@angular/core';

//import { Observable } from 'rxjs/Observable';

//import { StorageService } from './storage.service';
//import { LoggerService } from './logger.service';
//import { UtilsService } from './utils.service';
//import { NotificationsService } from './notifications.service';

//@Injectable()
//export class IdentityService {
//    private static readonly ADDRESS_KEY = 'ADDRESS_KEY';
//    private static readonly PK_KEY = 'PK_KEY';

//    constructor(
//        private loggerService: LoggerService,
//        private storageService: StorageService) { }

//    private address: string = null;
//    private pk: string;
    
//    public isLoggedIn(): boolean {
//        return !!this.getAddress();
//    }

//    public getAddress() {
//        if (!this.address) {
//            const persistedVal = this.storageService.getItem(IdentityService.ADDRESS_KEY);
//            if (persistedVal) {
//                this.address = persistedVal;
//            }
//        }

//        return this.address;
//    }

//    public setAddress(address: string) {
//        this.address = address.toLowerCase();
//        this.storageService.setItem(IdentityService.ADDRESS_KEY, this.address);
//    }

//    public removeAddress() {
//        this.address = null;
//        this.storageService.removeItem(IdentityService.PK_KEY);
//    }

//    public getPk() {
//        if (!this.pk) {
//            const persistedVal = this.storageService.getItem(IdentityService.PK_KEY);
//            if (persistedVal) {
//                this.pk = persistedVal;
//            }
//        }

//        return this.pk;
//    }

//    public setPk(address: string) {
//        this.pk = address.toLowerCase();
//        this.storageService.setItem(IdentityService.PK_KEY, this.pk);
//    }

//    public removePk() {
//        this.pk = null;
//        this.storageService.removeItem(IdentityService.PK_KEY);
//    }
    
//    public removeAll() {
//        this.removePk();
//        this.removeAddress();
//    }

//    private log(message: string, isError: boolean = false) {
//        this.loggerService.debugOrError('[S]IDENTITY', message, isError);
//    }
//}
