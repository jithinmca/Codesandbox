import { ApplicationUserService } from '../application-user.service';
import { ApplicationUserBase} from '../application-user.base.model';
import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppUtilBaseService } from '@baseapp/app-util.base.service';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ChangeLogsComponent } from '@baseapp/widgets/change-logs/change-logs.component'
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationPopupComponent } from '@baseapp/widgets/confirmation/confirmation-popup.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { debounceTime, fromEvent, distinctUntilChanged, of, Observer, map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { allowedValuesValidator } from '@baseapp/widgets/validators/allowedValuesValidator';
import { dateValidator } from '@baseapp/widgets/validators/dateValidator';
import { ActionItem } from '@baseapp/widgets/action-bar/action-bar.component';
import { BaseAppConstants } from '@baseapp/app-constants.base';
import { AppGlobalService } from '@baseapp/app-global.service';
import { AppBaseService } from '@baseapp/app.base.service';
import { WorkflowSimulatorComponent } from '@baseapp/widgets/workflow-simulator/workflow-simulator.component';
import { BreadcrumbService } from '@baseapp/widgets/breadcrumb/breadcrumb.service';

@Directive(
{
	providers:[MessageService, ConfirmationService, DialogService]
}
)
export class ApplicationUserDetailBaseComponent{
	
	
	isSearchFocused:boolean = false;
showBreadcrumb = BaseAppConstants.showBreadcrumb;
	comments: string ='';
confirmationReference:any;
	id: any;
pid:any;
isMobile: boolean = BaseAppConstants.isMobile;
backupData:any = {};
hiddenFields:any = {};
data:any = {};
formErrors:any = {};
inValidFields:any = {};
formFieldConfig:any = {};
securityJson:any = {
}
formConfig = {};     
actionButtons:ActionItem[] = [];  
wizardItems:any = [];
currentUserData = this.appGlobalService.get('currentUser');
selectedItems:any ={};
workflowType = "";
workFlowEnabled = false;
workFlowInitialState = "";
workFlowField = "";
workflowActions:any ={
    disableActions:[],
    enableActions:[],
    hideActions:[]
  };
  isFormValueChanged: boolean = false;
  mandatoryFields:any ={};
  validatorsRetained:any ={};
  isSaveResponseReceived:boolean = false;
  formSecurityConfig:any = {};
  enableReadOnly = BaseAppConstants.enableReadOnly;
 showScrollSpy = BaseAppConstants.showScrollSpy;
isRowSelected:boolean = true; 
isPrototype = environment.prototype;
isList = false;
detailPageIgnoreFields:any=[];
autoSuggestPageNo:number = 0;
complexAutoSuggestPageNo:number = 0
  fieldEditMode: any = {};
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
actionBarConfig:any =[];
	bsModalRef?: BsModalRef;
	isChildPage:boolean = false;

	
	leftActionBarConfig : any = {
  "children" : [ {
    "outline" : "true",
    "buttonType" : "icon_on_left",
    "visibility" : "show",
    "showOn" : "both",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-arrow-left",
        "value" : "fas fa-arrow-left"
      }
    },
    "action" : "back",
    "buttonEnabled" : "yes",
    "label" : "BACK",
    "type" : "button"
  }, {
    "outline" : "true",
    "label" : "BUTTON_GROUP",
    "type" : "buttonGroup",
    "children" : [ {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "buttonEnabled" : "yes",
      "action" : "save",
      "conditionForButtonEnable" : "",
      "label" : "SAVE",
      "visiblity" : "show",
      "type" : "button"
    }, {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "buttonEnabled" : "yes",
      "action" : "cancel",
      "conditionForButtonEnable" : "",
      "label" : "CANCEL",
      "visiblity" : "show",
      "type" : "button"
    }, {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "buttonEnabled" : "yes",
      "action" : "changelog",
      "conditionForButtonEnable" : "",
      "label" : "CHANGELOG",
      "visiblity" : "show",
      "type" : "button"
    } ],
    "displayCount" : 2,
    "buttonStyle" : "curved"
  } ]
}
	workflowActionBarConfig : any = {
  "children" : [ {
    "outline" : true,
    "label" : "BUTTON_GROUP",
    "type" : "buttonGroup",
    "children" : [ ],
    "buttonStyle" : "curved",
    "displayCount" : 2
  } ],
  "label" : "Workflow Action Bar",
  "type" : "workflowActionBar"
}
	detailCaptionBarConfig : any = {
  "children" : [ ]
}
	detailFormStructureConfig : any = {
  "children" : [ ]
}
	detailFormConfig : any = {
  "children" : [ {
    "data" : "",
    "field" : "email",
    "label" : "EMAIL",
    "fieldId" : "email",
    "timeOnly" : false,
    "fieldType" : "string",
    "uiType" : "email",
    "name" : "email",
    "type" : "formField",
    "fieldName" : "email"
  }, {
    "data" : "",
    "field" : "firstName",
    "label" : "FIRST_NAME",
    "fieldId" : "firstName",
    "timeOnly" : false,
    "fieldType" : "string",
    "uiType" : "text",
    "name" : "firstName",
    "type" : "formField",
    "fieldName" : "firstName"
  }, {
    "data" : "",
    "field" : "lastName",
    "label" : "LAST_NAME",
    "fieldId" : "lastName",
    "timeOnly" : false,
    "fieldType" : "string",
    "uiType" : "text",
    "name" : "lastName",
    "type" : "formField",
    "fieldName" : "lastName"
  } ],
  "columns" : "1",
  "type" : "form"
}
	pageViewTitle: string = 'APPLICATION_USER_DETAIL';
	
		detailFormControls : FormGroup = new FormGroup({
	lastName: new FormControl('',[]),
	firstName: new FormControl('',[]),
	email: new FormControl('',[]),
});


	constructor(public applicationUserService: ApplicationUserService, public appUtilBaseService: AppUtilBaseService, public translateService: TranslateService, public messageService: MessageService, public confirmationService: ConfirmationService, public dialogService: DialogService, public domSanitizer: DomSanitizer, public bsModalService: BsModalService, public activatedRoute: ActivatedRoute, public breadcrumbService: BreadcrumbService, public appBaseService: AppBaseService, public router: Router, public appGlobalService: AppGlobalService, public location: Location, ...args: any) {
    
 	 }

	
	restrictEditandView(ele: any, action: string, fieldName: string, fromActionBar?: boolean) {
    const conResult = this.appUtilBaseService.evaluvateCondition(ele?.query?.rules, ele?.query?.condition, this.detailFormControls.getRawValue(), this.formFieldConfig);
    if (fromActionBar) {
      this.allocateActions(fieldName, conResult, action)
    } else {
      if (action == 'view') {
        this.hiddenFields[fieldName] = conResult ? false : true;
      }
      else if (action == 'edit') {
        conResult ? this.detailFormControls.get(fieldName)?.enable({ emitEvent: false }) :
          this.detailFormControls.get(fieldName)?.disable({ emitEvent: false });
      }
    }
  }
	bindLookupFields(): void {
    const lookupArray: any = []
    for (const ele in this.formFieldConfig) {
      if (this.formFieldConfig[ele].uiType === 'autosuggest' && this.formFieldConfig[ele].filterOutputMapping) {
        this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.valueChanges.subscribe((obj) => {
          this.formFieldConfig[ele].filterOutputMapping.map((filter: any) => {
            if (this.formFieldConfig[ele].multipleValues && obj) {
              obj?.map((o: any) => {
                const filterValue = o.value? o.value[filter.lookupField]:o[filter.lookupField];
                lookupArray.push(filterValue);
              })
              this.detailFormControls?.get(filter.tableField)?.patchValue(lookupArray.toString());
            }
            else if(obj){
              const filterValue = obj.value? obj.value[filter.lookupField]:obj[filter.lookupField];
              this.detailFormControls?.get(filter.tableField)?.patchValue(filterValue);
            }
          })
        })
      }
    }
  }
	canDeactivate(): Observable<boolean> | boolean {
    
     if(this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData,this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields),true)){
       return true;
     }
    else{
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          message: this.translateService.instant('DISCARD_UNSAVED_CHANGES'),
          header: 'Confirmation',
          icon: 'pi pi-info-circle',
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.complete();
          },
        });
      });
    }
  }
	onBack(){
    
	this.messageService.clear();
	if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields), true)){			
     this.location.back();
	}else{
		this.confirmationService.confirm({
		    message:this.translateService.instant('DISCARD_UNSAVED_CHANGES'),
			header:'Confirmation',
			icon:'pipi-info-circle',
			accept:()=>{
				this.backupData = JSON.parse(JSON.stringify(this.detailFormControls.getRawValue()));
				this.location.back();
			},
			reject:()=>{
			},
		});
	}
}
	formatFormDataBeforeSave() {
    let data = this.detailFormControls.getRawValue();
    for (const ele in this.formFieldConfig) {
      const ec = this.formFieldConfig[ele];
      if (ec.columns && !ec.multipleValues) {
        data[ec.name] = this.configureRequestData(data[ec.name], ec.columns, ec.name)
      }
      else if (ec.columns && ec.multipleValues && data[ec.name]) {
        data[ec.name]?.map((o: any,index:number) => {
          const tempData = this.configureRequestData(data[ec.name][index], ec.columns, ec.name,index);
          data[ec.name][index] = tempData;
        })
      }
    }
    data = this.configureRequestData(data,this.detailFormConfig.children);
    return data;
  }
	configureFormOnWorkflow() {
    const actions: any = this.workflowActionBarConfig?.children;
    const workflowInformation = {
      actors: this.data?.workflowInfo && this.data?.workflowInfo[this.workflowType]?.userTypes || [],
      step: this.data?.workflowInfo && this.data?.workflowInfo[this.workflowType]?.step || ''
    }
    this.formSecurityConfig = this.appUtilBaseService.getFormSecurityConfigFromSecurityJSON(this.securityJson, this.detailFormControls, actions, workflowInformation);
    console.log(this.formSecurityConfig)
    this.hiddenFields = this.formSecurityConfig.hidefields;

    for (const control in this.detailFormControls.getRawValue()) {
      if (this.formSecurityConfig.disableonlyfields.indexOf(control) > -1)
      // && !(this.formSecurityConfig.enableonlyfields.indexOf(control) > -1)) 
      {
        this.detailFormControls.controls[control].disable({ emitEvent: false });
      }
      if (this.formSecurityConfig.enableonlyfields.indexOf(control) > -1) {
        this.detailFormControls.controls[control].enable({ emitEvent: false });
      }
      if (this.formSecurityConfig.hidefields.indexOf(control) > -1 )
      // && !(this.formSecurityConfig.showfields.indexOf(control) > -1)) 
      {
        this.hiddenFields[control] = true;
      }
      if (this.formSecurityConfig.showfields.indexOf(control) > -1) {
        this.hiddenFields[control] = false;
      }
    }
    this.workflowActions = {
      disableActions: [...this.formSecurityConfig.disableonlyactions],
      enableActions: [...this.formSecurityConfig.enableonlyactions],
      hideActions: [...this.formSecurityConfig.hideactions],
      showActions: [...this.formSecurityConfig.showactions]
    }
  }
	initFormValidations(){
    this.detailFormControls.enable({ emitEvent: false });
    this.hiddenFields = {};
    this.updateAllowedActions();
    this.formValueChanges();
    this.disableDependantFields();
  }

showMessage(config:any){
    this.messageService.clear();
    this.messageService.add(config);
}
	initForm(){
    this.formFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.detailFormConfig);
    this.actionBarConfig = this.appUtilBaseService.getActionsConfig(this.leftActionBarConfig.children);
    this.appUtilBaseService.configureValidators(this.detailFormControls, this.formFieldConfig);
       this.wizardItems = this.appUtilBaseService.getWizardItemFromFormConfig(this.detailFormStructureConfig, this);

 this.bindLookupFields();
    this.getData();
}
	checkValidations(): boolean {
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, this.formErrors, finalArr, this.inValidFields)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), sticky: true });
      }
      return false;
    }
    else
      return true;
  }
	restrictBasedonRoles(roles: any) {
    if (roles?.includes('selected')) {
       if(this.currentUserData){
        const userDataKeys = Object.keys(this.currentUserData[0]);
        return roles?.some((item: any) => userDataKeys.includes(item.toLowerCase()));
      }
      else{
        return false;
      }
    }
    else if (roles?.includes('all'))
      return true;
    else
      return true;
  }
	loadActionbar(){
    
}
	initWorkflow(){
    if (this.workFlowInitialState && this.workFlowEnabled && this.workFlowField) {
      this.detailFormConfig?.children?.forEach((ele: any) => {
        if (ele?.field === this.workFlowField && ele?.multipleValues) {
          this.detailFormControls.get(this.workFlowField)?.patchValue([this.workFlowInitialState], { emitEvent: false });
          this.backupData[this.workFlowField] = [this.workFlowInitialState];
        }
        else {
          if (ele?.field === this.workFlowField && !ele?.multipleValues) {
            this.detailFormControls.get(this.workFlowField)?.patchValue(this.workFlowInitialState, { emitEvent: false });
            this.backupData[this.workFlowField] = this.workFlowInitialState;
          }
        }
      })
      if (!environment.prototype && !this.id) {
        this.configureFormOnWorkflow();
      }
    }
  }
	normalize(data:any){
    return data;
  }
	actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
    else if (typeof this[action] === "function") {
      this[action]();
    }
  }
	waitForResponse() {
    if(environment.prototype){
      this.getWorkflowConfig();
    }
    else{
      setTimeout(() => {
        if (this.id && !environment.prototype) {
          if (!this.data?.workflowInfo) {
            this.waitForResponse();
          }
          else {
            this.getWorkflowConfig();
          }
        }
      }, 3000);
    }
  
  }
	getWorkflowConfig() {
    const workFlowInfo = this.data?.workflowInfo;
    const params = {
      workflowType: this.workflowType
    }
    if(environment.prototype && this.workFlowEnabled){
      this.appBaseService.getPrototypingworkflow(this.workflowType).subscribe((res:any)=>{
        this.securityJson = res.config;
      })
    }
    else if (workFlowInfo && this.workFlowEnabled){
        this.appBaseService.getWorkFlowConfig(params).subscribe((res: any) => {
          this.securityJson = res.config;
          this.configureFormOnWorkflow();
        })
    }
  }
	getDateTimeFields() {
    return ['createdDate','modifiedDate'];
  }

  getDateFields() {
    return [];
  }

  /**
  * Ignore fields from displaying in the changelog details
  */
  getIgnoreFields() {
    return ['sid', 'pid'];
  }

 onChangelog() {
    const initialState: ModalOptions = {
      initialState: {
        class: 'modal-xl',
        changelogConfig: {
          dateFields: this.getDateFields(),
          dateTimeFields: this.getDateTimeFields(),
          ignoreFields: this.getIgnoreFields(),
          filters: [{
            label: 'BASIC_DETAIL'
          }],
          entityId : this.data.sid,
          entityName : 'ApplicationUser',
          fieldName : null,
          fromModifiedDate : new Date().getTime(),
          useModifiedDate: true,
          translations: {}
        },
        keyboard: true
        
      }
    };
    this.bsModalRef = this.bsModalService.show(ChangeLogsComponent, Object.assign(initialState, { class: 'modal-xl modal-changelog' }));
    this.bsModalRef.content.closeBtnName = 'Close';
  }
	createAutoSuggestFields(ele: any) {
    if (!this.selectedItems?.hasOwnProperty(ele)) {
      this.selectedItems[ele] = [];
    }

  }
	updateActions(actionConfig:any){
    if(actionConfig.visibility === 'conditional' && actionConfig.conditionForButtonVisiblity){
      this.restrictEditandView(actionConfig.conditionForButtonVisiblity,'view',actionConfig.action,true);
    }
    if(actionConfig.buttonEnabled === 'conditional' && actionConfig.conditionForButtonEnable){
      this.restrictEditandView(actionConfig.conditionForButtonEnable,'edit',actionConfig.action,true);
    }
  }
	getDisabled(formControl: FormGroup, ele: string) {
  const parent = ele.split('?.')[0];
  if (formControl.controls[parent] instanceof FormGroup){
    return formControl.get(ele)?.disabled
  }
  else
    return formControl.controls[parent].disabled;
}
	getId(){
      this.activatedRoute.queryParams.subscribe((params: any) => { 
        this.id = params['id'];
        this.pid = params['pid']
      }); 
    }
	bindData(data: any, ele: any,parentEle?:string,index?:number) {
    if (ele.fieldType == 'Date' && data) {
      const formattedDate = new Date(data)
      return formattedDate;
    }
    if (ele.uiType === 'autosuggest' && ele.multipleValues) {
      let arr: any[] = [];
      if (data && Array.isArray(data)) {
        data?.map((k: any) => {
          const eName = parentEle && (index != undefined && index >=0) ? `${parentEle}_${ele.name}_${index}`: parentEle ?`${parentEle}_${ele.name}`:ele.name;
          this.createAutoSuggestFields(eName);
          this.selectedItems[eName] = data
          const lookupData ={...k.value,sid:(k.id || k.sid)}
           arr.push(lookupData);
        })
        if (arr.length > 0) {
          return arr;
        }
      }
    }
    else if (ele.uiType === 'autosuggest' && !ele.multipleValues) {
      if (data && Object.keys(data).length > 0) {
        const eName = parentEle && (index != undefined && index >= 0) ? `${parentEle}_${ele.name}_${index}` : parentEle ? `${parentEle}_${ele.name}` : ele.name;
        this.createAutoSuggestFields(eName);
        this.selectedItems[eName].push(data);
        const lookupData ={...data.value,sid:(data.id|| data.sid)}
        const value = lookupData;
        return value;
      }
    }
    else {
      return data;
    }
  }
	openWorkflowSimilator() {
    const ref = this.dialogService.open(WorkflowSimulatorComponent, {
      header: 'Workflow Simulator',
      width: '350px',
      data: {
        statusFieldConfig: this.formFieldConfig[this.workFlowField],
        actorFieldConfig: Object.keys(this.securityJson).map((actor)=> {return{label:actor,value:actor}}),
        selectedValues: (this.data?.workflowInfo)? this.data?.workflowInfo[this.workflowType]:{userTypes:[],step:''}
      }
    });
    ref.onClose.subscribe((workflowInfo: any) => {
      if (workflowInfo) {
        this.reloadForm(workflowInfo);
      }
    });
  }
	formValueChanges() {
    this.detailFormControls.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged(),
    )
      .subscribe(() => {
        this.updateAllowedActions();
        this.isFormValueChanged = true;
      })
  }
	checkUnsavedComplexFields():any {
    const newRows:any = []
    let hasUnSavedChanges:boolean = false;
    const data = this.detailFormControls.getRawValue();
    const fields:any =[];
    const complexTable = (Object.keys(this.formFieldConfig)).filter(key=> this.formFieldConfig[key].columns && this.formFieldConfig[key].multipleValues)
       if(complexTable.length> 0){ 
         complexTable.map((field)=>{
          data[field]?.map((e: any) => {
            if(e.isNewRow || this.fieldEditMode[field]){
              hasUnSavedChanges = true;
              fields.push(field);
            }
              newRows.push(e);
          })
         })
       }
       return {
        newRows:newRows,
        fields:[...new Set(fields)],
        hasUnSavedChanges:hasUnSavedChanges
      }
    }
	scrolltoTop() {
    const tracker = (<HTMLInputElement>document.getElementsByClassName('main-content')[0])
    let windowYOffsetObservable = fromEvent(tracker, 'scroll').pipe(map(() => {
      return Math.round(tracker.scrollTop);
    }));
    const headerHeight: any = $('#header-container').outerHeight(true);
    const titleBarheight: any = $('#title-bar').outerHeight(true);

    windowYOffsetObservable.subscribe((scrollPos: number) => {
      if (scrollPos >= titleBarheight) {
        $('.wizard-container .p-tieredmenu').animate({
          top: headerHeight, marginTop: '10px'
        }, 0);
      }
      else {
        $('.wizard-container .p-tieredmenu').animate({
          top: headerHeight + titleBarheight
        }, 0);
      }
    })
  }
	addRequiredValidator(ele: any, fieldName: string) {
    const conResult = this.appUtilBaseService.evaluvateCondition(ele.query?.rules, ele.query?.condition, this.detailFormControls.getRawValue(), this.formFieldConfig);
    if (conResult) {
      this.detailFormControls.controls[fieldName].addValidators([Validators.required]);
    }
    else {
      this.detailFormControls.controls[fieldName].removeValidators([Validators.required]);
    }
    this.detailFormControls.controls[fieldName].updateValueAndValidity({ emitEvent: false });
    this.formFieldConfig[fieldName].isRequired = (conResult) ? true : false;
  }
	getValue(formControl: FormGroup, ele: string) {
    const parent = ele.split('?.')[0];
    if (formControl.controls[parent] instanceof FormGroup){
      const child = ele.split('?.')[1];
      return formControl.controls[parent].value[child];
    }
    else
      return formControl.controls[parent].value;
  }
	formatCaptionItems(config: any, data: any) {
    if (Object.keys(data).length > 0) {
      return (this.appUtilBaseService.formatRawDatatoRedableFormat(config, data[config.field]));
    }
    else {
      return '';
    }
  }
	confirmationPopup(fields: []) : Observable<boolean>{
    return Observable.create((observer: Observer<boolean>) => {
      this.confirmationService.confirm({
        message: this.translateService.instant('COMPLEX_RECORD_SAVE_CONFIRMATION', { field: fields.toString() }),
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          fields.map((o) => $($(`.${o}_editSave-btn`)).trigger('click'));
           observer.next(true) 
           observer.complete();       
          },
        reject: () => {
          fields.map((o) => $($(`.${o}_editCancel-btn`)).trigger('click'));
          observer.next(true) 
           observer.complete(); 
        },
      });
    });
  }
	setDefaultValues(){
      for (const ele in this.formFieldConfig) {
         if(this.formFieldConfig[ele].defaultVal && (this.formFieldConfig[ele].uiType === 'select' ||this.formFieldConfig[ele].uiType === 'checkboxgroup'|| this.formFieldConfig[ele].uiType === "radio")){
           const defaultValue = (this.formFieldConfig[ele].defaultVal);
           const defaultLabel = (defaultValue.replace(/ /g,"_"))?.toUpperCase();
           if(this.formFieldConfig[ele].multiple || this.formFieldConfig[ele].uiType === 'checkboxgroup'){
            this.detailFormControls.controls[ele].patchValue([defaultLabel],{ emitEvent: false });
            this.backupData[ele]  = [defaultLabel];
           }
           else{
            this.detailFormControls.controls[ele].patchValue(defaultLabel,{ emitEvent: false });
            this.backupData[ele]  = defaultLabel;
           }
         }
         else if(['Boolean'].includes(this.formFieldConfig[ele].fieldType) ){
          const defaultBooleanValues = this.formFieldConfig[ele].defaultVal? this.formFieldConfig[ele].defaultVal:false;
         this.detailFormControls.controls[ele].patchValue(defaultBooleanValues,{ emitEvent: false });
         this.backupData[ele]  = defaultBooleanValues;
        }
      }
    
    }
	loadCaptionbarItems(){
    
}
	getData(){
  if (environment.prototype && this.id) {
    const params = {
      sid: this.id
    };
    this.applicationUserService.getProtoTypingDataById(params).subscribe((res: any) => {
      this.data = res;
      this.backupData = res;
      this.detailFormControls.patchValue(this.backupData);
    });
  } else if (this.id) {
    const params = {
      sid: this.id
    };
    this.applicationUserService.getById (params).subscribe((res: ApplicationUserBase[]) => {
      this.data = res || {};
      this.formatRawData();
    });
  }
  else {
    this.backupData = JSON.parse(JSON.stringify(this.detailFormControls.getRawValue()));
  }
}
	generateRequestObj(data: any) {
    const props = Object.keys(data);
    let requestedObj: any = {};
    props.forEach((o: any) => {
      if (this.detailFormControls.controls[o] instanceof FormGroup && !this.formFieldConfig[o].multiple) {
        data[o] = this.configureEmptyValuestoNull(data[o])
      }
      else if (this.detailFormControls.controls[o] instanceof FormGroup && this.formFieldConfig[o].multiple) {
        data[o].map((k: any, index: number) => { data[o][index] = this.configureEmptyValuestoNull(data[o][index]) })
      }
    })
    requestedObj = this.configureEmptyValuestoNull(data);
    return requestedObj;
  }
	reloadForm(workflowInfo: any) {
    if(this.id){
      const dataObsr$: any = this.data ? of(this.data) : this.getData();
      dataObsr$.subscribe((res: any) => {
        this.data.workflowInfo ={
          [this.workflowType]:workflowInfo
        };
       const methodName: any = "configureFormOnWorkflow";
        let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
        if (typeof this[action] === "function") {
          this[action]();
          this.updateAllowedActions();
          this.formValueChanges();
        }
       
       
      })
    }
  }
	updateFields(formFieldConfig: any, ele: string, childEle: string) {
    const fieldConfig = (childEle) ? formFieldConfig[ele][childEle] : formFieldConfig[ele];

    if (fieldConfig.allowViewing === 'no') {
      if (childEle){
        if(!this.hiddenFields[this.formFieldConfig[ele].name])
          this.hiddenFields[this.formFieldConfig[ele].name] ={};
      this.hiddenFields[this.formFieldConfig[ele].name][fieldConfig.name] = true;
      }
      else
        this.hiddenFields[this.formFieldConfig[ele].name] = true;
    }
    else if (fieldConfig.viewConditionally && fieldConfig.allowViewing === 'conditional') {
      this.restrictEditandView(fieldConfig.viewConditionally, 'view', fieldConfig.name)
    }
    if (fieldConfig.allowEditing === 'no') {
      if (childEle)
        this.detailFormControls.get(`${[this.formFieldConfig[ele].name]}.${fieldConfig.name}`)?.disable({ emitEvent: false });
      else
        this.detailFormControls.get(fieldConfig.name)?.disable({ emitEvent: false });
    }
    else if (this.formFieldConfig[ele].editConditionally && this.formFieldConfig[ele].allowEditing === 'conditional') {
      this.restrictEditandView(fieldConfig.editConditionally, 'edit', fieldConfig.name)
    }
    if (this.formFieldConfig[ele].mandatory === 'conditional' && this.formFieldConfig[ele].conditionalMandatory) {
      this.addRequiredValidator(fieldConfig.conditionalMandatory, fieldConfig.name);
    }
  }
	configureRequestData(data: any, ele: any, parentEle?:string,index?:number) {
if (Array.isArray(ele)) {
    ele.map((ele: any) => {
      if (ele.fieldType == 'Date' && data[ele.name]) {
        const formattedDate = new Date(data[ele.name]).getTime()
        data[ele.name] = formattedDate;
      }
      else if (ele.fieldType === 'Boolean') {
        if (data[ele.name] === null || data[ele.name] === undefined || data[ele.name] === '') {
          data[ele.name] = false;
        }
      }          
      if(ele.uiType == 'autosuggest' && !(Array.isArray(data[ele.name]) || typeof data[ele.name] === 'object')) {
        data[ele.name] = null;
      }
    })
   }
    if (Object.keys(this.selectedItems).length > 0) {
      const keys = Object.keys(this.selectedItems);
      keys?.forEach((k) => {
        const e = parentEle? k.split('_')[1]:k;
       if(parentEle && (index != undefined && index >=0)) {
          const keyarr = k.split('_');
        
          if (data.hasOwnProperty(e) && parentEle === keyarr[0] && index.toString() == keyarr[2]) {
            data[e] = this.selectedItems[k];
          }
        } 
        else if(parentEle){
          if (data.hasOwnProperty(e) && parentEle === k.split('_')[0]) {
            data[e] = this.selectedItems[k];
          }
        }
        else {
          if (data.hasOwnProperty(e) ) {
            data[e] = this.selectedItems[k];
          }
        }
      });
      ele.map((ele: any) => {
      if (ele.uiType == 'autosuggest' && data[ele.name] && !ele.multipleValues) {
          data[ele.name] = (Array.isArray(data[ele.name]) && data[ele.name].length > 0) ? data[ele.name][0] :(Array.isArray(data[ele.name]) && data[ele.name].length <=0)? {}: data[ele.name];
        }
      })
    }
    return data;
  }
	allocateActions(label: string, result: boolean, action: string) {
    if (action === 'view') {
      if (result && this.conditionalActions.hideActions.includes(label))
        this.conditionalActions.hideActions?.splice(this.conditionalActions.hideActions?.indexOf(label), 1)
      else if (!result && !this.conditionalActions.hideActions.includes(label))
        this.conditionalActions.hideActions.push(label);
    }
    else if (action === 'edit') {
      if (result && this.conditionalActions.disableActions.includes(label))
        this.conditionalActions.disableActions.splice(this.conditionalActions.disableActions?.indexOf(label), 1);
      else if (!result && !this.conditionalActions.disableActions.includes(label))
        this.conditionalActions.disableActions.push(label);
    }
  }
	denormalize(backupData: any) {
}
	formatRawData() {
    this.denormalize(this.data);
        // since this.data cannot be directly used for patch value, doing a deep copy
        // Deep copy converts date into string, so copy is performed before formatting
    let patchData = JSON.parse(JSON.stringify(this.data));
    this.selectedItems = [];
    for (const e in this.formFieldConfig) {
      const ec = this.formFieldConfig[e];
      if (ec.columns && !ec.multipleValues && this.data[ec.name]) {
        for (const e1 in this.data[ec.name]) {
           const ec1 = ec[e1];
          if(this.data[ec.name]){
          this.data[ec.name][ec1.name] = this.bindData(this.data[ec.name][ec1.name], ec1,ec.name);
          patchData[ec.name][ec1.name] = this.bindData(this.data[ec.name][ec1.name], ec1,ec.name);
          }
        }
      }
      else if (ec.columns && ec.multipleValues && this.data[ec.name]) {
        this.data[ec.name]?.map((o: any, index: number) => {
          for (const e1 in o) {
            const ec1 = ec[e1];
            if (this.data[ec.name]) {
              this.data[ec.name][index][ec1.name] = this.bindData(this.data[ec.name][index][ec1.name], ec1,ec.name,index);
              patchData[ec.name][index][ec1.name] = this.bindData(this.data[ec.name][index][ec1.name], ec1,ec.name,index);
            }
          }
        })
      }
      else {
       if(!ec.columns && this.data[ec.name]){
          this.data[ec.name] = this.bindData(this.data[ec.name], ec);
                  patchData[ec.name] = this.bindData(this.data[ec.name], ec);
        }        
      }
    }
   
   
// const patchData = JSON.parse(JSON.stringify(this.data));
this.detailFormControls.patchValue(patchData,{ emitEvent: false });
this.backupData = JSON.parse(JSON.stringify(this.detailFormControls.getRawValue()));

  }
	configureEmptyValuestoNull(data:any){
       const value =  Object.keys(data).reduce((acc:any, key:string) => {acc[key] = data[key] === '' ||(Array.isArray(data[key]) && data[key].length == 0)? null : 
    data[key]; return acc; }, {})
    return value;
  }
	clearValidations(mandatoryFields: []) {
    mandatoryFields.forEach((controlName: string) => {
      if (!(this.validatorsRetained[controlName] && this.validatorsRetained[controlName]['requiredValidator'])) {
        this.detailFormControls.controls[controlName].removeValidators(Validators.required);
        this.detailFormControls.controls[controlName].updateValueAndValidity({emitEvent:false});
      }

    })
  }
	disableDependantFields() {
    let hasUnfilledValues:boolean = false;
    const detailFormControls = this.detailFormControls.getRawValue()
    for (const ele in this.formFieldConfig) {
      if (this.formFieldConfig[ele].uiType === 'autosuggest' && this.formFieldConfig[ele].mandatoryFilters) {
        this.formFieldConfig[ele].filterInputMapping?.map((filter: { lookupField: string,tableField:string }) => {
          const fieldName = filter.tableField.split('.')[0];
          if (this.formFieldConfig[ele].mandatoryFilters.includes(filter.lookupField) && (detailFormControls[fieldName] === null || detailFormControls[fieldName]=== undefined || detailFormControls[fieldName] === '')){
            hasUnfilledValues = true;
          }
        })
        hasUnfilledValues?this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.disable({ emitEvent: false }):
        this.detailFormControls.get(this.formFieldConfig[ele].fieldName)?.enable({ emitEvent: false });
      }
    }
  }
	updateAllowedActions() {
    for (const ele in this.formFieldConfig) {
      if (this.detailFormControls.controls[ele] instanceof FormGroup) {
        for (const childEle in this.formFieldConfig[ele])
          this.updateFields(this.formFieldConfig, ele, childEle);
      }
      else {
        this.updateFields(this.formFieldConfig, ele, '');
      }
    }

    this.actionBarConfig.forEach((action:any)=>{
      this.updateActions(action);
    })
  }
	workflowActionBarAction(btn: any) {
    const methodName: any = (`onwf` + btn.wfAction.charAt(0).toUpperCase() + btn.wfAction.slice(1));
    let action: Exclude<keyof ApplicationUserDetailBaseComponent, ' '> = methodName;
    const finalArr: string[] = [];
    this.formErrors = {};
    this.inValidFields = {};
    this.mandatoryFields = this.formSecurityConfig?.mandatoryfields?.hasOwnProperty(btn.wfAction) ? this.formSecurityConfig.mandatoryfields[btn.wfAction] : {}
    if (Object.keys(this.mandatoryFields).length > 0)
      this.addValidations(this.mandatoryFields);

    if (!this.appUtilBaseService.validateNestedForms(this.detailFormControls, this.formErrors, finalArr, this.inValidFields)) {
      if (finalArr.length) {
        this.showMessage({ severity: 'error', summary: 'Error', detail: this.appUtilBaseService.createNotificationList(finalArr), sticky: true });
        if (Object.keys(this.mandatoryFields).length > 0)
          this.clearValidations(this.mandatoryFields);
      }
    }
  else {
      if (typeof this[action] === "function") {
        this.confirmationReference= this.dialogService.open(ConfirmationPopupComponent, {
          header: 'Confirmation',
          width: '30%',
          contentStyle: { "max-height": "500px", "overflow": "auto" },
          styleClass: "confirm-popup-container",
          data: {
            confirmationMsg: `Do you want to ${btn.wfAction} the record ?`,
            isRequired: this.formSecurityConfig.comments?.hasOwnProperty(btn.wfAction) && this.formSecurityConfig.comments[btn.wfAction],
            action:btn.label
          }
        });

        this.confirmationReference.onClose.subscribe((result: any) => {
          if (Object.keys(this.mandatoryFields).length > 0)
            this.clearValidations(this.mandatoryFields);
          if (result?.accepted) {
            this.comments = result.comments;
            if (this.isFormValueChanged) {
              this.isSaveResponseReceived = false;
              const isToastNotNeeded = true;
              this.onSave(isToastNotNeeded);
              let checkResponse = setInterval(() => {
                if (this.isSaveResponseReceived) {
                  this[action]();
                  clearInterval(checkResponse);
                }
              }, 1000);
            }
            else {
              this[action]();
            }
          }
        });
      }
    }
  }
addValidations(mandatoryFields:[]){
    mandatoryFields.forEach((controlName:string)=>{
      if(this.detailFormControls.controls[controlName].hasValidator(Validators.required)){
        if(!(this.validatorsRetained.hasOwnProperty(controlName))){
          this.validatorsRetained[controlName]= {}
        }
        this.validatorsRetained[controlName]['requiredValidator'] = true;
      }
      else{
        this.detailFormControls.controls[controlName].addValidators([Validators.required]);
        this.detailFormControls.controls[controlName].updateValueAndValidity({emitEvent:false});
      }
     })
  }
	checkColumnProperty(fieldName: string, table: string) {
    const columnConfig = this.formFieldConfig[table]?.columns?.find((item: any) => item.name == fieldName);
    return ((columnConfig.hidden) ? false : true);
  }
	onWizardClick(event: any) {
    this.wizardItems.forEach((item: any) => {
      delete item.styleClass;
    });
    event.item.styleClass = 'wizard-active';
    let el: any = $("#section" + event.item.id);
    if (el?.length) {

      $('.main-content').animate({
        scrollTop: el.offset().top
      }, 100);
    }
  }
	onSave(isToastNotNeeded ?: boolean) {
  if (this.appUtilBaseService.isEqualIgnoreCase(this.detailFormControls.getRawValue(), this.backupData, this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(), this.backupData, this.detailPageIgnoreFields), true)) {
    this.showMessage({ severity: 'info', summary: '', detail: this.translateService.instant('NO_CHANGES_AVAILABLE_TO_SAVE') });
    return;
  }
  if (this.checkValidations()) {
    const complexData = this.checkUnsavedComplexFields();
    if (complexData.hasUnSavedChanges) {
    
      complexData.fields.map((o: any) => $($('.'+o+'_editSave-btn')).trigger('click'));
    }
    let preFormattedData = this.formatFormDataBeforeSave();
    let data = this.normalize(preFormattedData)
    const method = this.id ? 'update' : 'create';
    data = { ...this.backupData, ...data };
    if (this.pid) {
      data.pid = this.pid;
    }
    if (this.id) {
      data.sid = this.id
    }

    const requestedObj = this.generateRequestObj(data);
    this.messageService.clear();
    this.applicationUserService[method](requestedObj).subscribe((res: ApplicationUserBase) => {
      this.data = { ...data, ...res };
      this.formatRawData();
      this.isSaveResponseReceived = true;
      this.isFormValueChanged = false;
      this.id = res.sid;
      if (method === 'create') {
        this.router.navigate(
          [],
          {
            queryParams: { id: this.id },
            relativeTo: this.activatedRoute,
            queryParamsHandling: 'merge',
            replaceUrl: true
          }).then(() => { this.onInit() });
        this.getId();
      }
      if (!isToastNotNeeded) {
        this.showMessage({ severity: 'success', summary: '', detail: this.translateService.instant('RECORD_SAVED_SUCCESSFULLY') });
      }
    }, (err: any) => { this.isSaveResponseReceived = true; });

  }
}
	onCancel(){
  this.messageService.clear();
  if (this.appUtilBaseService.isEqualIgnoreCase(this.backupData, this.detailFormControls.getRawValue(), this.appUtilBaseService.getIgnorableFields(this.detailFormControls.getRawValue(),this.backupData,this.detailPageIgnoreFields), true)) {
    this.showMessage({ severity: 'info', summary: '', detail: this.translateService.instant('NO_CHANGES_AVAILABLE_TO_CANCEL') });
  } else {
    this.confirmationService.confirm({
      message: this.translateService.instant('DISCARD_UNSAVED_CHANGES'),
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        const patchData = JSON.parse(JSON.stringify(this.backupData));
        this.detailFormControls.patchValue(patchData,{ emitEvent: false });
      },
      reject: () => {
      },
    });
  }

}

    onInit() {
		
		this.waitForResponse();
this.initWorkflow();
		
this.getId();   
this.initForm();
this.setDefaultValues();
this.initFormValidations();

    }
	
     onDestroy() {
		
    }
     onAfterViewInit() {
		
		 this.scrolltoTop();
    }

}
