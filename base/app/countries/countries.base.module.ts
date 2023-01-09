import { NgModule } from '@angular/core';
import { CountriesDetailComponent } from '@app/countries/countries/countries-detail/countries-detail.component';
import { SharedModule } from '@app/shared/shared.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { WidgetsBaseModule } from '@baseapp/widgets/widgets.base.module';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';
import { CountriesListComponent } from '@app/countries/countries/countries-list/countries-list.component';

@NgModule({
  declarations: [
CountriesDetailComponent,
CountriesListComponent
],
imports: [
SharedModule,
WidgetsBaseModule
],

exports: [
SharedModule,
WidgetsBaseModule,
CountriesDetailComponent,
CountriesListComponent
],

providers: [
BsModalService,
CanDeactivateGuard
],
  
})
export class CountriesBaseModule { }