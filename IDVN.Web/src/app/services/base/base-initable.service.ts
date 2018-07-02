import { UtilsService } from '../core/utils.service';
import { Observable } from 'rxjs/Observable';

export abstract class BaseInitableService {
    protected initialized: boolean = false;
    protected initializing: boolean = false;
    protected stopping: boolean = false;
    protected subscriptions: Array<any> = [];

    private preInitObservables: Array<any> = [];
    private preInitCbs: Array<any> = [];

    public init() {
        this.log('init');

        if (this.initialized) {
            this.log('Already initialized - canceling');
            return UtilsService.observableFromEmpty();
        }

        if (this.initializing) {
            this.log('Already initializing - canceling');
            return UtilsService.observableFromEmpty();
        }

        if (!this.initCheck()) {
            this.log('initCheck not passed - canceling');
            return UtilsService.observableFromEmpty();
        }

        this.initializing = true;

        return UtilsService.observableFromCb(done => {
            this.initImpl().subscribe(() => {
                this.log(`init DONE with ${this.preInitObservables.length} pre init observables and ${this.preInitCbs.length} pre init cbs`);

                this.initialized = true;
                this.initializing = false;

                this.preInitObservables.forEach(obs => obs.observable().subscribe(r => obs.done(true, r)));
                this.preInitCbs.forEach(obs => obs.done(true, obs.cb()));

                done(true);
            }, error => {
                this.log('init FAIL', true);
                this.log(error, true);

                this.initializing = false;

                done(false, error);
            });
        });
    }

    public stop() {
        this.log('stop');

        if (!this.initialized) {
            this.log('Not initialized - canceling');
            return UtilsService.observableFromEmpty();
        }

        if (this.stopping) {
            this.log('Already stopping - canceling');
            return UtilsService.observableFromEmpty();
        }

        if (!this.stopCheck()) {
            this.log('initCheck fail - canceling');
            return UtilsService.observableFromEmpty();
        }

        this.stopping = true;

        this.subscriptions.forEach(s => s.unsubscribe());

        return UtilsService.observableFromCb(done => {
            this.stopImpl().subscribe(() => {
                this.log('stop DONE');

                this.stopping = false;
                this.initialized = false;

                done(true);
            }, error => {
                this.log('stop FAIL', true);
                this.log(error, true);

                this.stopping = false;

                done(false, error);
            });
        });
    }

    public ensureInitedObservableFromCb(cb: any): Observable<any> {
        if (this.initialized) {
            return UtilsService.observableFrom(cb());
        }
        else {
            return UtilsService.observableFromCb(done => {
                this.preInitCbs.push({ done: done, cb: cb });
            });
        }
    }

    public ensureInitedFromCb(cb: any) {
        if (this.initialized) {
            cb();
        }
        else {
            this.preInitCbs.push({ cb: cb, done: () => { } });
        }
    }

    protected abstract initImpl();

    protected abstract stopImpl();

    protected initCheck() {
        return true;
    }

    protected stopCheck() {
        return true;
    }

    protected abstract log(message: string, isError?: boolean);
}
