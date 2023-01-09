import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Resolve, Router } from '@angular/router';
import { PrototypeVariables } from '@baseapp/auth/prototype.variables';
import { Guid } from 'guid-typescript';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

const authpresetInfoVar: string = "PROTO_PRESET";
const authInfoVar: string = "PROTO_AUTH";

@Injectable()
export class AuthenticationResolver implements Resolve<any> {
  prototypeUrl = new URL(PrototypeVariables.DESIGN_STUDIO_URL).origin;
  lsAuthInfo: any = localStorage.getItem(authInfoVar);
  presetAuthInfo: any = localStorage.getItem(authpresetInfoVar);

  constructor(
    public router: Router,
    public auth: AuthService,
    public route: ActivatedRoute
  ) {

  }
  public authenticate(): Observable<any> {

    let authenticated = false;

    let params = window.location.href;
    const currentUserSubject = new Observable((observer: any) => {

      let authId;

      let paramValue;
      if (params.includes('?')) {
        const httpParams = new HttpParams({ fromString: params.split('?')[1] });
        authId = httpParams.get("token");
      }

      if (authId != null) {

        let authGuid;
        if (Object.keys(this.presetAuthInfo).length) {
          let presetGuid = this.presetAuthInfo[PrototypeVariables.APP_ID];

          if (presetGuid == authId) {
            authenticated = true;

            delete this.presetAuthInfo[PrototypeVariables.APP_ID];
            localStorage.setItem(authpresetInfoVar, JSON.stringify(this.presetAuthInfo));

           /* this.lsAuthInfo[PrototypeVariables.APP_ID] = {
              guid: authId,
              from: new Date().getTime()
            }
            localStorage.setItem(authInfoVar, JSON.stringify(this.lsAuthInfo));*/
          }


        } /*else if (Object.keys(this.lsAuthInfo).length) {
          let authDetail: any = this.lsAuthInfo[PrototypeVariables.APP_ID];

          if (authDetail) {
            authGuid = authDetail.guid;

            let validTime = this.getValidTime(authDetail.from);
            if (new Date().getTime() < validTime) {
              if (authGuid == authId) {
                authenticated = true;
              }
            } else {
              delete this.lsAuthInfo[PrototypeVariables.APP_ID];
              localStorage.setItem(authInfoVar, JSON.stringify(this.lsAuthInfo));
            }
          }

        }*/


      } /*else {

        if (Object.keys(this.lsAuthInfo).length) {
          let authDetail: any = this.lsAuthInfo[PrototypeVariables.APP_ID];

          let validTime = this.getValidTime(authDetail.from);
          if (new Date().getTime() < validTime) {
            authenticated = true;
          } else {
            delete this.lsAuthInfo[PrototypeVariables.APP_ID];
            localStorage.setItem(authInfoVar, JSON.stringify(this.lsAuthInfo));
          }

        }

      }*/

      if (authenticated) {
        observer.next(true);
      } else {
        observer.error({});
      }


    });

    return currentUserSubject;
  }

  getValidTime(from: any) {
    return from + (1 * 60 * 60 * 1000);
  }
  resolve() {

    // if (this.lsAuthInfo) {
    //   this.lsAuthInfo = JSON.parse(this.lsAuthInfo);
    // } else {
    //   this.lsAuthInfo = {};
    // }


    if (this.lsAuthInfo) {
      if (typeof this.lsAuthInfo == "string")
        this.lsAuthInfo = JSON.parse(this.lsAuthInfo);
    } else {
      this.lsAuthInfo = {};
    }

    if (this.presetAuthInfo) {
      if (typeof this.presetAuthInfo == "string"){
        this.presetAuthInfo = JSON.parse(this.presetAuthInfo);
      }
    } else {
      this.presetAuthInfo = {};
    }

    return this.authenticate().pipe(
      take(1),
      catchError((error : any) => {

        let guid: any = Guid.create();

        //Token : remove 
        let protoUrl = location.href;

        if(protoUrl.indexOf('token') > -1){
          let splittedParams = protoUrl.split("?");

          if(splittedParams.length > 1 && splittedParams[1].indexOf('token') > -1){
            let params = splittedParams[1].split("&");
            for(var i = 0; i < params.length; i++){
              if(params[i].indexOf('token') == 0){
                params.splice(i, 1);

                if(params.length){
                  let paramString = params.join("&");
                  protoUrl = splittedParams[0] + "?" + paramString;
                  break;
                } else {
                  protoUrl = splittedParams[0];
                }
                
              }
            }
          }
        }        

        let redirectUrl = `${this.prototypeUrl}/#/login?appId=${PrototypeVariables.APP_ID}&tenantId=${PrototypeVariables.TENANT_ID}&redirectUrl=${encodeURIComponent(protoUrl)}&token=${encodeURIComponent(guid.value)}`;
        redirectUrl = redirectUrl.replace("http://", "https://");

        this.presetAuthInfo[PrototypeVariables.APP_ID] = guid.value;
        localStorage.setItem(authpresetInfoVar, JSON.stringify(this.presetAuthInfo));

        window.location.href = redirectUrl;
        return error;
      })
    );
  }
}