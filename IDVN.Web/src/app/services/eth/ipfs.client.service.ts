import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class IPFSClientService {
    public isInitialized(): Observable<boolean> {
        return Observable.of(false);
    }

    public update(file: File) {
        // TODO
    }

    public read(name: string) {
        // TODO
    }
}
