import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

import { CountriesDetailComponent } from '@app/countries/countries/countries-detail/countries-detail.component';
import { CountriesListComponent } from '@app/countries/countries/countries-list/countries-list.component';

export const routes: Routes = [

{
     path: 'countriesdetail',
     component: CountriesDetailComponent,
     canDeactivate: [ CanDeactivateGuard ],
     data: {
     	label: "COUNTRIES_DETAIL",
        breadcrumb: "COUNTRIES_DETAIL",
        roles : [
        			"all"
				]
     }
},
{
     path: 'countrieslist',
     component: CountriesListComponent,
     canDeactivate: [ CanDeactivateGuard ],
     data: {
     	label: "COUNTRIES_LIST",
        breadcrumb: "COUNTRIES_LIST",
        roles : [
        			"all"
				]
     }
}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CountriesBaseRoutingModule
{
}
