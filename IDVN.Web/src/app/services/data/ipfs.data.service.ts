import { Injectable } from '@angular/core';
import { RequestOptions, Headers as NgHeaders } from '@angular/http';

import { HttpService } from '../core/http.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IPFSDataService {
    constructor(
        private httpService: HttpService) { }

    public initialized: boolean = true;

    public update(file: any): Observable<string> {
        if (!file) {
            return Observable.empty();
        }

        return this.httpService.postFormData('UpdateAvatarHash', { avatar: file }).map(r => {
            return r.hash;
        });
    }
}
