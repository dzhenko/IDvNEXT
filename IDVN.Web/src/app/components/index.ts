import { AppComponent } from './app.component';

import { FooterMenuComponent } from './footermenu/footermenu.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './navmenu/navmenu.component';

import { LoaderComponent } from './shared/loader/loader.component';
import { WizardComponent } from './shared/wizard/wizard.component';



export * from './app.component';

export * from './footermenu/footermenu.component';
export * from './home/home.component';
export * from './navmenu/navmenu.component';

export * from './shared/loader/loader.component';
export * from './shared/wizard/wizard.component';



export const APP_COMPONENTS = [
    AppComponent,

    FooterMenuComponent,
    HomeComponent,
    NavMenuComponent,

    LoaderComponent,
    WizardComponent
];
