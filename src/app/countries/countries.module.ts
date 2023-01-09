import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountriesRoutingModule } from './countries-routing.module';
import { CountriesBaseModule } from '@baseapp/countries/countries.base.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CountriesBaseModule,
    CountriesRoutingModule
    
  ],
  exports: [
      CountriesBaseModule,
  ]

})
export class CountriesModule  { }