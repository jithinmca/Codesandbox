import { Injectable } from "@angular/core";
import { AuthBaseService } from "@baseapp/auth/auth.base.service";
import { BaseService } from "@baseapp/base.service";

@Injectable({
    providedIn: 'root',
  })
  export class AuthService extends AuthBaseService {

    constructor(
        override baseService : BaseService
    ){
        super(baseService)
    }

  }