import {Routes } from '@angular/router';
import { AppLayoutComponent } from '@app/app-layout/app-layout.component';
import { AppHomePageComponent } from '@app/app-home-page/app-home-page.component';
import { AuthenticationResolver } from '@app/auth/authentication.resolver';
import { LoginDetailComponent } from '@app/auth/login/login.component';

export const routes: Routes = [ 
  {
     path: '',
     redirectTo: "/countries/countrieslist",
     pathMatch: 'full'
  }, 
  {
    path: 'home',
    component: AppHomePageComponent,
    resolve:{authResolver:AuthenticationResolver}
  },
  {
    path: '',
    component: AppLayoutComponent,
    resolve:{authResolver:AuthenticationResolver},
    children: [
      {
        path: 'applicationuser',
        loadChildren: () => import('@app/application-user/application-user.module').then(m => m.ApplicationUserModule)
      },
      {
        path: 'countries',
        loadChildren: () => import('@app/countries/countries.module').then(m => m.CountriesModule)
      }
   	]
  }
];