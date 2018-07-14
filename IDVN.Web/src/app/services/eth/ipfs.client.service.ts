import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UtilsService } from '../core/utils.service';

@Injectable()
export class IPFSClientService {
    constructor() {
        if (window['IpfsApi']) {
            this.ipfs = window['IpfsApi']('localhost', '5001');
            this.initialized = true;
        }
    }

    public initialized: boolean = false;

    private ipfs: any = null;

    public update(file: File): Observable<string> {
        if (!file) {
            return Observable.empty();
        }

        return UtilsService.observableFromCb(done => {
            var reader = new FileReader();

            reader.onload = () => {
                let fileBuffer = this.ipfs.Buffer.from(reader.result);
                return this.ipfs.files.add(fileBuffer, (err, result) => {
                    if (err) {
                        done(false, err);
                        return;
                    }

                    if (result && result.length) {
                        done(true, result[0].hash);
                    }
                });
            }

            reader.readAsArrayBuffer(file);
        });        
    }
}
