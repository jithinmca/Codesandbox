import { allowedValuesValidator } from '@baseapp/widgets/validators/allowedValuesValidator';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit, ElementRef, Renderer2, ViewChild, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogService } from 'primeng/dynamicdialog';
import { CountriesService } from '@baseapp/countries/countries/countries.service';
import { fromEvent, Subscription, map } from 'rxjs';
import { Filter } from '@baseapp/vs-models/filter.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ChangeLogsComponent } from '@baseapp/widgets/change-logs/change-logs.component';
import { environment } from '@env/environment';
import { CountriesListBaseComponent } from '@baseapp/countries/countries/countries-list/countries-list.base.component';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { BaseAppConstants } from '@baseapp/app-constants.base';

@Component({
  selector: 'app-countries-list',
  templateUrl: '../../../../../base/app/countries/countries/countries-list/countries-list.component.html',
  styleUrls: ['./countries-list.scss']
})
export class CountriesListComponent extends CountriesListBaseComponent implements OnInit {
 
  constructor(public override countriesService: CountriesService, public override appUtilBaseService: AppUtilBaseService, public override translateService: TranslateService, public override messageService: MessageService, public override confirmationService: ConfirmationService, public override dialogService: DialogService, public override domSanitizer: DomSanitizer, public override bsModalService: BsModalService, public override activatedRoute: ActivatedRoute, public override renderer2: Renderer2, public override router: Router) {
    super(countriesService, appUtilBaseService, translateService, messageService, confirmationService, dialogService, domSanitizer, bsModalService, activatedRoute, renderer2, router);
  }
	
  ngAfterViewInit(): void {
    this.onAfterViewInit()
  }

  ngOnInit(): void {
    super.onInit();
  }
 
}