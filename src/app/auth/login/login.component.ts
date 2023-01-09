import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppUtilBaseService } from "@baseapp/app-util.base.service";
import { LoginComponentBase } from "@baseapp/auth/login/login.component.base";
import { MessageService } from "primeng/api";
import { AuthService } from "../auth.service";


@Component({
  selector: 'app-login',
  templateUrl: '../../../../base/app/auth/login/login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[ MessageService]
})
export class LoginDetailComponent extends LoginComponentBase implements OnInit{

  @ViewChild('submitBtn') private submitBtn: any;
  constructor(
    override router : Router,
    override appUtilService : AppUtilBaseService,
    override messageService : MessageService,
    override authService : AuthService
  ) {
    super(
      router,
      appUtilService,
      messageService,
      authService
    );
  }

  ngOnInit(): void {
    super.onInit();
  }

  override authenticate (): void {
    this.submitBtn.nativeElement.click();
    super.authenticate();
  }

}
