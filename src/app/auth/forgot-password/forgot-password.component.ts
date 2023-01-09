import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AppUtilBaseService } from "@baseapp/app-util.base.service";
import { ForgotPasswordComponentBase } from "@baseapp/auth/forgot-password/forgot-password.component.base";
import { LoginComponentBase } from "@baseapp/auth/login/login.component.base";
import { MessageService } from "primeng/api";
import { AuthService } from "../auth.service";


@Component({
  selector: 'app-forgot-password',
  templateUrl: '../../../../base/app/auth/forgot-password/forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers:[ MessageService]
})
export class ForgotPasswordComponent extends ForgotPasswordComponentBase implements OnInit{

  @ViewChild('submitBtn') private submitBtn: any;
  constructor(
    override router : Router,
    override appUtilService : AppUtilBaseService,
    override messageService : MessageService,
    override authService : AuthService,
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

  override resetPassword(): void {
    this.submitBtn.nativeElement.click();
    super.resetPassword();
  }

}
