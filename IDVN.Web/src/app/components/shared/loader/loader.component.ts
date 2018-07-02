import { Component, OnInit } from '@angular/core';

import { LoaderService } from '../../../services/index';

@Component({
    selector: 'loader',
    templateUrl: './loader.component.html'
})
export class LoaderComponent implements OnInit {
    public showLoading: boolean = false;

    ngOnInit() {
        LoaderService.onToggle.subscribe(v => this.showLoading = v);
    }
}
