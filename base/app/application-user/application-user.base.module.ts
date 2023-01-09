import { NgModule } from '@angular/core';
import { ApplicationUserListComponent } from '@app/application-user/application-user/application-user-list/application-user-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ApplicationUserDetailComponent } from '@app/application-user/application-user/application-user-detail/application-user-detail.component';
import { WidgetsBaseModule } from '@baseapp/widgets/widgets.base.module';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

@NgModule({
  declarations: [
ApplicationUserListComponent,
ApplicationUserDetailComponent
],
imports: [
SharedModule,
WidgetsBaseModule
],

exports: [
SharedModule,
WidgetsBaseModule,
ApplicationUserListComponent,
ApplicationUserDetailComponent
],

providers: [
BsModalService,
CanDeactivateGuard
],
  
})
export class ApplicationUserBaseModule { }