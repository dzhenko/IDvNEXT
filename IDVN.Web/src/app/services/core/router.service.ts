import { Injectable, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

import { ReplaySubject } from 'rxjs/ReplaySubject';

import { LoggerService } from './logger.service';
import { LoaderService } from './loader.service';

@Injectable()
export class RouterService {
    constructor(
        private router: Router,
        private location: Location,
        private injector: Injector,
        private loggerService: LoggerService) {

        this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationStart) {
                this.routes[e.url] = true;
                this.onStart.next(true);
            } else if (e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError) {
                delete this.routes[e.url];
                if (Object.getOwnPropertyNames(this.routes).length === 0) {
                    this.onEnd.next(true);
                }
            }
        });
    }

    private routes: any = {};

    private onStart: ReplaySubject<any> = new ReplaySubject(1);
    private onEnd: ReplaySubject<any> = new ReplaySubject(1);

    public _getRouteKey(key: string) {
        return this._getRoute().snapshot.params[key];
    }

    public _getRoute() {
        return this.injector.get(ActivatedRoute);
    }

    public changeLocationWithoutChangingRoute(path: string) {
        this.log('changeLocationWithoutChangingRoute -> ' + path);
        this.location.go(path);
    }

    public locationReplaceState(path: string) {
        this.location.replaceState(path);
    }

    public goHome() {
        this.navigate(['']);
    }

    public subscribeOnStart(observerOrNext) {
        return this.onStart.subscribe(observerOrNext);
    }

    public subscribeOnEnd(observerOrNext) {
        return this.onEnd.subscribe(observerOrNext);
    }

    public navigateByUrl(url: string) {
        this.router.navigateByUrl(url);
    }

    public navigate(commands: any[]) {
        LoaderService.showFor(2000);
        this.router.navigate(commands, { replaceUrl: true });
    }

    public navigateToMarket(market: string) {
        this.navigate(['exchange', market]);
    }

    public getUrl() {
        return this.router.url;
    }

    public getFullUrl() {
        return location.href;
    }

    private log(message: string, isError: boolean = false) {
        this.loggerService.debugOrError('[S]ROUTER', message, isError);
    }
}
