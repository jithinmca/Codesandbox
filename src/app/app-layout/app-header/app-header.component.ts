import { Component, OnInit } from '@angular/core';
import { AppHeaderBaseComponent } from '@baseapp/app-layout/app-header/app-header.base.component';
import { AppLayoutBaseService } from '@baseapp/app-layout/app-layout.service.base';
import { TranslateService } from '@ngx-translate/core';
import { AppUtilBaseService } from "@baseapp/app-util.base.service";
import { AppLayoutService } from '../app-layout.service';


@Component({
  selector: 'app-header',
  templateUrl: '../../../../base/app/app-layout/app-header/app-header.component.html',
  styleUrls: ['../../../../base/app/app-layout/app-header/app-header.component.scss']
})
export class AppHeaderComponent extends AppHeaderBaseComponent implements OnInit {

  constructor(override translate: TranslateService, override bs: AppLayoutService, override utilBase: AppUtilBaseService) {
    super(translate, bs, utilBase)
  }

  ngOnInit(): void {
    super.onInit();
  }


}
