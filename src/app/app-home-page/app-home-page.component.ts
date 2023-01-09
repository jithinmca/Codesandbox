import { Component, OnInit } from '@angular/core';
import { AppHomePageBaseComponent } from "@baseapp/app-home-page/app-home-page-base.component";
import { AppHomeBaseService } from '@baseapp/app-home-page/app-home.service.base';
import { AppUtilBaseService } from "@baseapp/app-util.base.service";

@Component({
  selector: 'app-home-page',
  templateUrl: '../../../base/app/app-home-page/app-home-page-base.component.html',
  styleUrls: ['../../../base/app/app-home-page/app-home-page-base.component.scss']
})
export class AppHomePageComponent extends AppHomePageBaseComponent {

  constructor(override bs: AppHomeBaseService, override utilBase: AppUtilBaseService) {
    super(bs, utilBase)
  }

  ngOnInit(): void {
    super.onInit();
  }

}
