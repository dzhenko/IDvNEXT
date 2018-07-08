import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { 
    HomeComponent,
    DevComponent,

    ClaimAliasComponent,
    SearchAliasComponent,
    ListAliasComponent
 } from './components/index';

export const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },

    { path: 'alias/claim', component: ClaimAliasComponent },
    { path: 'alias/claim/:id', component: ClaimAliasComponent },
    { path: 'alias/search', component: SearchAliasComponent },
    { path: 'alias/list', component: ListAliasComponent },

    { path: 'dev', component: DevComponent },

    { path: '**', redirectTo: 'home' }
];

@NgModule({
    imports: [RouterModule.forRoot(APP_ROUTES)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
