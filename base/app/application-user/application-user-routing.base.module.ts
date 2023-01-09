import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@baseapp/auth.can-deactivate-guard.service';

import { ApplicationUserListComponent } from '@app/application-user/application-user/application-user-list/application-user-list.component';
import { ApplicationUserDetailComponent } from '@app/application-user/application-user/application-user-detail/application-user-detail.component';

export const routes: Routes = [

{
     path: 'applicationuserlist',
     component: ApplicationUserListComponent,
     canDeactivate: [ CanDeactivateGuard ],
     data: {
     	label: "APPLICATION_USER_LIST",
        breadcrumb: "APPLICATION_USER_LIST",
        roles : [
        			"Development Administrator"
				]
     }
},
{
     path: 'applicationuserdetail',
     component: ApplicationUserDetailComponent,
     canDeactivate: [ CanDeactivateGuard ],
     data: {
     	label: "APPLICATION_USER_DETAIL",
        breadcrumb: "APPLICATION_USER_DETAIL",
        roles : [
        			"Development Administrator"
				]
     }
}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ApplicationUserBaseRoutingModule
{
}
