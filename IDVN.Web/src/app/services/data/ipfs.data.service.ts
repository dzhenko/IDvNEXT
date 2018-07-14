import { Injectable } from '@angular/core';
import { RequestOptions, Headers as NgHeaders } from '@angular/http';

import { HttpService } from '../core/http.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IPFSDataService {
    constructor(
        private httpService: HttpService) {

    }

    public isInitialized(): Observable<boolean> {
        return Observable.of(true);
    }

    public update(file: any): Observable<string> {
        if (!file) {
            return Observable.empty();
        }

        return this.httpService.postFormData('UpdateAvatarHash', { avatar: file}).map(r => r.hash);
    }

    public read(name: string) {
        this.httpService.get('ReadAvatarHash').subscribe(r => {
            debugger;
        });
    }
}
