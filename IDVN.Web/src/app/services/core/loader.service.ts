import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class LoaderService {
    public static onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

    private static value: boolean = false;

    public static show() {
        if (LoaderService.value === false) {
            LoaderService.value = true;
            LoaderService.onToggle.emit(true);
            console.log('showing loader');
            // $('#loaderwrapper').show();
            // $('#appwrapper').hide();
        }
    }

    public static hide() {
        if (LoaderService.value === true) {
            LoaderService.value = false;
            LoaderService.onToggle.emit(false);
            console.log('hiding loader');
            // $('#loaderwrapper').hide();
            // $('#appwrapper').show();
        }
    }

    public static showFor(ms: number) {
        if (LoaderService.value === false) {
            LoaderService.show();
            setTimeout(() => LoaderService.hide(), ms);
        }
    }
}
