import { Component, OnInit } from '@angular/core';

import { AppService, LoaderService } from '../services/index';

@Component({
    selector: 'app',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    constructor(
        private appService: AppService) { }

    ngOnInit() {
        LoaderService.show();
        this.appService.init().subscribe(() => LoaderService.hide());
    }
}
