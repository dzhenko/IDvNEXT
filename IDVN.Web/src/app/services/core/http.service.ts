import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { IdentityService } from './identity.service';
import { LoggerService } from './logger.service';

import { environment } from '../../../environments/environment';

@Injectable()
export class HttpService {
    constructor(
        private http: Http,
        private identityService: IdentityService,
        private loggerService: LoggerService) { }

    public get(url: string, options: RequestOptionsArgs = null): Observable<any> {
        const opts = this.buildOptions(options);
        this.log('GET -> ' + url);

        return this.http.get(environment.apiUrl + 'api/' + url, opts)
            .map((res: Response) => {
                this.log('GET SUCCESS -> ' + url);
                return this.extractData(res);
            })
            .catch(err => {
                this.log('GET ERROR -> ' + url);
                return this.handleError(err);
            });
    }

    public post(url: string, data: any, options: RequestOptionsArgs = null): Observable<any> {
        const opts = this.buildOptions(options);
        this.log('POST -> ' + url);

        return this.http.post(environment.apiUrl + 'api/' + url, data, opts)
            .map((res: Response) => {
                this.log('POST SUCCESS -> ' + url);
                return this.extractData(res);
            })
            .catch(err => {
                this.log('POST ERROR -> ' + url);
                this.loggerService.debug(err);
                return this.handleError(err);
            });
    }

    private extractData(res: Response) {
        if (res.text()) {
            const body = res.json();
            if (body && body.data) {
                return body.data;
            }

            return body;
        }

        return res;
    }

    private handleError(error: any) {
        if (!error) {
            return Observable.throw('An unknown error has occurred.');
        }

        let errMsg = '';
        if (error.text) {
            errMsg = error.text();
            if (errMsg) {
                try {
                    const parsed = JSON.parse(errMsg);
                    if (parsed) {
                        const keys = Object.getOwnPropertyNames(parsed);
                        if (keys.length) {
                            const message = parsed[keys[0]];
                            if (typeof (message) === 'string') {
                                errMsg = message;
                            } else if (typeof (message) === 'object' && message.length) {
                                errMsg = message[0];
                            } else if (message) {
                                errMsg = message;
                            }
                        }
                    }
                } catch (e) {
                    // No need errMsg to be parsed
                }
            }
        } else {
            errMsg = error.message || error.status || error.statusText;
        }

        this.loggerService.error(errMsg);

        return Observable.throw(errMsg);
    }

    public postFormData(url: string, data: any, options: RequestOptionsArgs = null): Observable<any> {
        const formData = this.buildFormData(data);
        options = options || {};
        options.headers = options.headers || new Headers();

        this.log('POST FORM DATA -> ' + url);

        return this.http.post(environment.apiUrl + 'api/' + url, formData, options)
            .map((res: Response) => {
                this.log('POST FORM DATA SUCCESS -> ' + url);
                return this.extractData(res);
            })
            .catch(err => {
                this.log('POST FORM DATA ERROR -> ' + url);
                this.loggerService.debug(err);
                return this.handleError(err);
            });
    }

    private buildOptions(options: RequestOptionsArgs): RequestOptionsArgs {
        options = options || {};
        options.headers = options.headers || new Headers();

        if (!options.headers.has('Content-Type')) {
            options.headers.append('Content-Type', 'application/json');
        }

        const address = this.identityService.getAddress();
        if (address) {
            options.headers.set('User', address);
        }

        return options;
    }

    private buildFormData(data: any): FormData {
        const formData: FormData = new FormData();

        for (let key in data) {
            const currentProperty = data[key];

            if (Array.isArray(currentProperty)) {
                for (let i = 0; i < currentProperty.length; i++) {
                    for (let elementName in currentProperty[i]) {
                        formData.append(`${key}[${elementName}]`, currentProperty[i][elementName]);
                    }
                }
            } else {
                formData.append(key, currentProperty);
            }
        }

        return formData;
    }

    private log(message: string, isError: boolean = false) {
        this.loggerService.debugOrError('[S]HTTP', message, isError);
    }
}
