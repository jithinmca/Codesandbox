import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AppGlobalService } from '@baseapp/app-global.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthenticationResolver implements Resolve<any> {

  constructor(
    public router: Router,
    public auth: AuthService,
    public appGlobalService:AppGlobalService
  ) { }
  public authenticate(): Observable<any> {
    const latest = combineLatest([this.auth.authenticate({})])
    return latest;
  }
  
  resolve() {
    return this.authenticate().pipe(map(res => {
      this.appGlobalService.write('currentUser', res);
    }),
      take(1),
      catchError((error) => {
        console.log("resolver loaded");
        let redirectUrl = window.location.hash;
        let loginUrl = '/auth/login';
        if (redirectUrl.indexOf("login") == -1) {
          loginUrl += "?redirectUrl=" + encodeURIComponent(redirectUrl);
        }
        this.router.navigateByUrl(loginUrl);
        return of(false);
        return of('No data');
      })
    )
  }
}