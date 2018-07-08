import { AppComponent } from './app.component';

import { ClaimAliasComponent } from './alias/claim/claim.component';
import { ListAliasComponent } from './alias/list/list.component';
import { SearchAliasComponent } from './alias/search/search.component';

import { DevComponent } from './dev/dev.component';

import { FooterMenuComponent } from './footermenu/footermenu.component';
import { HomeComponent } from './home/home.component';
import { NavMenuComponent } from './navmenu/navmenu.component';

import { LoaderComponent } from './shared/loader/loader.component';
import { WizardComponent } from './shared/wizard/wizard.component';



export * from './app.component';

export * from './alias/claim/claim.component';
export * from './alias/list/list.component';
export * from './alias/search/search.component';

export * from './dev/dev.component';

export * from './footermenu/footermenu.component';
export * from './home/home.component';
export * from './navmenu/navmenu.component';

export * from './shared/loader/loader.component';
export * from './shared/wizard/wizard.component';



export const APP_COMPONENTS = [
    AppComponent,

    ClaimAliasComponent,
    ListAliasComponent,
    SearchAliasComponent,

    DevComponent,

    FooterMenuComponent,
    HomeComponent,
    NavMenuComponent,

    LoaderComponent,
    WizardComponent
];
