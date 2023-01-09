import { Injectable } from "@angular/core";
import { BaseService } from "@baseapp/base.service";
import { environment } from "@env/environment";
import { Observable, of } from "rxjs";
import { AuthApiConstants } from './auth.api-constants';
import { PrototypeVariables } from "./prototype.variables";

@Injectable({
    providedIn: 'root',
})
export class AuthBaseService {
    constructor(
        public baseService: BaseService
    ){}
    
    login(params:any){
        const currentUserSubject = new Observable((observer:any) => {
            this.baseService.get(AuthApiConstants.login).subscribe(
              (data: any) => {
                observer.next(data);
              },
              (error: any) => {
                observer.error(error);
              }
            );
          });
    
          return currentUserSubject;
    }
    authenticate(params?:any){
      // const url = AuthApiConstants.authenticate.url.replace('{APP_ID}',PrototypeVariables.APP_ID);
      const url = AuthApiConstants.authenticate.url;
      const currentUserSubject = new Observable((observer:any) => {
          this.baseService.get({url : url}).subscribe(
            (data: any) => {
              observer.next(data);
            },
            (error: any) => {
              observer.error(error);
            }
          );
        });

        return currentUserSubject;
    
    }
    recoverPassword(params: any){
        const currentUserSubject = new Observable((observer:any) => {
            this.baseService.get({url: '/login'}, params).subscribe(
              (data: any) => {
                observer.next(data);
              },
              (error: any) => {
                observer.error(error);
              }
            );
          });
    
          return currentUserSubject;
    }
  }