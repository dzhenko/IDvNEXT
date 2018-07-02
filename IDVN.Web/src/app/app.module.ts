import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/Rx';

import { AppRoutingModule } from './app.routing';

import { AppComponent, APP_COMPONENTS } from './components/index';
import { APP_SERVICES } from './services/index';
import { APP_DIRECTIVES } from './directives/index';
import { APP_PIPES } from './pipes/index';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule
    ],

    declarations: [
        APP_COMPONENTS,
        APP_DIRECTIVES,
        APP_PIPES
    ],

    providers: [
        APP_SERVICES,
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        }
    ],

    bootstrap: [AppComponent]
})

export class AppModule { }
