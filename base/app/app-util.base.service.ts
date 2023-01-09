import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { forkJoin, Observable, Observer, Subject } from 'rxjs';
import { formatDate, formatNumber, formatCurrency, getCurrencySymbol } from '@angular/common';
import { BaseAppConstants } from './app-constants.base';
import { TranslateService } from '@ngx-translate/core';
import { AppGlobalService } from './app-global.service';
import { environment } from '@env/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppUtilBaseService {

  constructor(
    public confirmationService: ConfirmationService,
    public translateService: TranslateService,
    public appGlobalService: AppGlobalService
  ) { }


  wizard:any = [];

 
  isEqualIgnoreCase(data1: any, data2: any, ignoreProperties?: any, isCaseSensitive?: boolean) {
    //data1 - should be formData;
    //data2 - should be backupData;
    isCaseSensitive = isCaseSensitive || false;
    if (this.checkCase(data1, isCaseSensitive) === this.checkCase(data2, isCaseSensitive) || data1 === data2) { return true; }
    if ((typeof data1 !== 'object' || typeof data2 !== 'object')) {
      return this.checkCase(data1, isCaseSensitive) === this.checkCase(data2, isCaseSensitive);
    }
    const isValueEmpty1 = (data1 == null || data1 === '' || data1 === undefined || $.isEmptyObject(data1));
    const isValueEmpty2 = (data2 == null || data2 === '' || data2 === undefined || $.isEmptyObject(data2));
    if (isValueEmpty1 && isValueEmpty2) { return true; }

    if (isValueEmpty1 && !isValueEmpty2) { return false; }
    if (!isValueEmpty1 && isValueEmpty2) { return false; }

    ignoreProperties = ignoreProperties ||[];
    let keys = Object.keys(data1 || {});
    const data2Keys = Object.keys(data2 || {});
    keys = keys.concat(Object.keys(data2 || {}));
    for (let index = 0; index < keys.length; index++) {

      const key = keys[index];
      const value1 = this.checkCase(data1[key], isCaseSensitive);
      const value2 = this.checkCase(data2[key], isCaseSensitive);
      if (ignoreProperties.indexOf(key) !== -1) { continue; }
      if (value1 === value2
        || ((value1 === null || value1 === '' || value1 === undefined)
          && (value2 === null || value2 === '' || value2 === undefined))) { continue; }

      const isValue1Array = Array.isArray(value1);
      const isValue2Array = Array.isArray(value2);
      if ((isValue1Array && !isValue2Array)
        || (!isValue1Array && isValue2Array)
        || (isValue1Array && isValue2Array
          && value1.length !== value2.length)) { return false; }
      let retVal = false;
      if (isValue1Array && isValue2Array) {
        if (value1.length === 0 && value2.length === 0) {
          retVal = true;
        } else {
         
          for (let arrIndex = 0; arrIndex < value1.length; arrIndex++) {
            let ignoreFields = (typeof value1[arrIndex] === 'object' && typeof value1[arrIndex] === 'object')? this.getIgnorableFields(value1[arrIndex], value2[arrIndex]):ignoreProperties;
            retVal = this.isEqualIgnoreCase(value1[arrIndex], value2[arrIndex],ignoreFields, isCaseSensitive)
            if (!retVal) { return false; }
          }
        }
      } else if (typeof value1 === 'object' && typeof value2 === 'object') {
        retVal = this.isEqualIgnoreCase(value1, value2, this.getIgnorableFields(value1, value2), isCaseSensitive)
      } else if ((typeof value1 === 'string' && typeof value2 === 'string') || (typeof value1 === 'number' && typeof value2 === 'number')) {
        retVal = (value1 === value2);
      }
      if (!retVal) {
        return false;
      }
    }

    return true;
  };


  getIgnorableFields(formControls: any, backupData: any,ignoreFields?:any) {
    ignoreFields = ignoreFields || [];
    let result: any = [];
    var keys = Object.keys(formControls);
    for (var key in backupData) {
      if (!keys.includes(key)) {
        result.push(key)
      }
    }
    result =[...result,...ignoreFields];
    return result;
  }

  checkCase(data: any, isCaseSensitive: boolean) {
    if (!data || !data.toUpperCase) { return data; }
    return isCaseSensitive ? data : data.toUpperCase();
  }
  getErrorLabel(error: string, fieldName = '') {
    let errLabel = error;
    switch (error) {
      case 'required':
        errLabel = 'required';
        break;
      case 'mandatoryCondition':
        errLabel = 'not matching its mandatory condition';
        break;
      case 'mandatoryCondition':
        errLabel = 'not matching its mandatory condition';
        break;
      case 'customMax':
      case 'max':
        errLabel = 'not matching its max-value condition';
        break;
      case 'customMin':
      case 'min':
        errLabel = 'not matching its min-value condition';
        break;
      case 'maxLength':
      case 'max_length':
      case 'maxlength':
        errLabel = 'not matching its max-length condition';
        break;
      case 'minLength':
      case 'min_length':
      case 'minlength':
        errLabel = 'not matching its min-length condition';
        break;
      case 'mandatoryCharacters':
        errLabel = 'not matching with mandatory characters';
        break;
      case 'allowedValues':
        errLabel = 'not matching with allowed values';
        break;
      case 'notAllowedValues':
        errLabel = 'contains not allowed values';
        break;

      case 'pattern':
        errLabel = 'not matching its accepted pattern';
        break;
      case 'email':
        errLabel = 'not valid';
        break;
      case 'invalidDate':
        errLabel = 'not valid';
        break;
      case 'weekDaysOnly':
        errLabel = 'allowing weekdays only';
        break;
      case 'weekEndsOnly':
        errLabel = 'allowing weekends only';
        break;
      default:
        errLabel = error;
    }

    return errLabel;
  }

  validateNestedForms(form: any, formErrors: any, finalArr: string[] = [], inValidFields: any = {}): boolean {
    let isValid: boolean = true;
    Object.keys(form.controls).forEach(field => {
      if (form.controls[field] instanceof FormGroup) {
        Object.keys(form.controls[field].controls).forEach(childField => {
          const obj = this.isValidForm(form.controls[field].controls, childField, formErrors, finalArr, inValidFields, field);
          if (!obj.isValid) {
            isValid = false;
          }
          finalArr = obj.finalArr;
          inValidFields = obj.inValidFields
        })
      }
      else {
        const obj = this.isValidForm(form.controls, field, formErrors, finalArr, inValidFields);
        if (!obj.isValid) {
          isValid = false;
        }
        finalArr = obj.finalArr;
        inValidFields = obj.inValidFields
      }

    })
    return isValid;
  }


  isValidForm(form: any, field: string, formErrors: any, finalArr: string[] = [], inValidFields: any = {}, parentForm?: string) {
    const allErrors: any = {};
    let isValid: boolean = true;

    const errors = form[field].errors;
    const fieldName = $(`.${field}-label`).text() || field;
      if (errors) {
        isValid = false;
        Object.keys(errors).forEach(errKey => {
          if (!formErrors[field]) {
            formErrors[field] = `${fieldName} ${errKey === 'notAllowedValues' ? '' : 'is'}  ${this.getErrorLabel(errKey)}`;
          }
          if (!allErrors[errKey]) {
            allErrors[errKey] = [];
          }
          allErrors[errKey].push(fieldName);
        if (parentForm) {
          if (!inValidFields[parentForm])
            inValidFields[parentForm] = {};
          inValidFields[parentForm][field] = true;
        }
        else
          inValidFields[field] = true;
        });
      }
    finalArr = this.findFormErrors(allErrors, finalArr);
    return {
      isValid: isValid,
      finalArr: finalArr,
      inValidFields: inValidFields
    }
  }




  findFormErrors(allErrors: any, finalArr: any) {
    for (const error in allErrors) {
      if (allErrors.hasOwnProperty(error)) {
        const element = allErrors[error];
        finalArr.push(`${allErrors[error].join(', ')} ${error === 'notAllowedValues' ? '' : allErrors[error].length > 1 ? 'are' : 'is' } ${this.getErrorLabel(error)}`);
      }
    }
    return finalArr;
  }

  canDeactivateCall(form: FormGroup, backupData: any): Observable<boolean> | boolean {
    if (this.isEqualIgnoreCase(form.getRawValue(), backupData, [], true)) {
      return true;
    }

    return Observable.create((observer: Observer<boolean>) => {

      this.confirmationService.confirm({
        message: 'Do you want to discard all unsaved changes?',
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

  frameFormFromConfig(formConfig: any) {

    formConfig = {
      readonlyForm: false,
      items: [
        {
          type: "section",
          items: [
            {
              type: "control"
            }
          ]
        },
        {
          type: "section",
          items: [
            {
              type: "section",
              items: [
                {
                  type: "control"
                },
                {
                  type: "control"
                }
              ]
            }
          ]
        }
      ]
    }

    const controls = this.getControlsFromSectionConfig(formConfig);
    const formControls = {};


    formConfig = {
      id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      createdBy: new FormControl(),
      modifiedBy: new FormControl(),
    };

    return formConfig;
  }

  getControlsFromSectionConfig(config: any, result: any = []): any {
    if (config?.items) {
      for (let index = 0; index < config.items.length; index++) {
        const current = config.items[index];
        if (current.type == "section") {
          this.getControlsFromSectionConfig(current, result);
        } else {
          result.push(current)
        }
      }
    }
    return result;
  }

  getControlsFromFormConfig(config: any, fields: any = {}, fileFields: string[] = []): any {
    if (config?.children?.length) {
      for (let index = 0; index < config.children.length; index++) {
        let current = config.children[index];
        if (current?.children && current?.children.length) {
          this.getControlsFromFormConfig(current, fields, fileFields);
        } else {
          current.isRequired = config.children[index].mandatory === 'yes' ? true : false;
           current.multiple = config.children[index].multipleValues? true : false;
          if(config.children[index].uiType == 'autosuggest'){
            current.lookupFields = config.children[index].lookupFields;
            current.displayField = config.children[index].displayField;
            current.multiple = config.children[index].multipleValues? true : false;
          }         
          if(config.children[index].type == 'customButton'){
            current.field = config.children[index].name;
          }
          if(config.children[index].fieldType == 'Table'){
            current = this.getComplexData(config.children[index]);
          }
          if(config.children[index].fieldType == 'Date'){
            current.calendarMinDate = config.children[index].minDate?new Date(config.children[index].minDate):null;
            current.calendarMaxDate = config.children[index].maxDate?new Date(config.children[index].maxDate):null;
          }
          if(config.children[index].uiType == 'currency'){
            current.currencyCode = config.children[index].currencySymbol?.toUpperCase() || 'USD';
          }
          
          current.allowEditing = config.children[index].allowEditing === 'no' ? 'no' : (config.children[index].allowEditing === 'yes' || config.children[index].allowEditing == 'undefined') ? 'yes' : 'conditional';
          current.allowViewing = config.children[index].allowViewing === 'no' ? 'no' : (config.children[index].allowViewing === 'yes' || config.children[index].allowViewing == 'undefined') ? 'yes' : 'conditional';
          if (config.children[index].allowEditing === 'conditional' && config.children[index].editConditionally) {
            current.editConditionally = config.children[index].editConditionally;
          }
          if (config.children[index].allowViewing === 'conditional' && config.children[index].viewConditionally) {
            current.viewConditionally = config.children[index].viewConditionally;
          }
          if (['file', 'image'].includes(current.uiType)) {
            fileFields.push(current.data);
          } else if (['dropdown', 'select'].includes(current.uiType)) {
            current.options = current.allowedValues?.values;
            current.optionConditions = {};
            if (current?.allowedValues?.conditions?.conditions) {
              current.allowedValues.conditions.conditions.forEach((condition: any) => {
                current.optionConditions[condition.id] = Object.assign({}, condition.style, {
                  iconStyle: {},
                  cellStyle: {
                    'background-color': condition.style['background-color'],
                    'color': condition.style['color'],
                  }
                });

                switch (condition?.style?.icon?.type) {
                  case 'uploaded':
                    Object.assign(current.optionConditions[condition.id], {
                      image: this.frameAttachmentURL(condition?.style?.icon?.icon[0]?.fileName, true)
                    })
                    break;
                  case 'icon':
                    Object.assign(current.optionConditions[condition.id], {
                      iconClass: condition?.style?.icon?.icon.value
                    });
                    if(condition?.style?.icon.iconColor){
                      Object.assign(current.optionConditions[condition.id].iconStyle,{color : condition?.style?.icon.iconColor})
                    }
                    if (condition?.style?.icon.iconSize) {
                      Object.assign(current.optionConditions[condition.id].iconStyle, { 'font-size': condition?.style?.icon.iconSize })
                    }
                    break;
                  default: break;
                }
              });
            }
          }
          fields[current.field] = current;
        }
      }
    }
    return fields;
  }


  getComplexData(config: any) {
    let nestedFields: any = config;
    config.columns.map((ele: any) => {
      nestedFields[ele.name] = ele;
      nestedFields[ele.name].isRequired = nestedFields[ele.name].mandatory === 'yes' ? true : false;
      if (['dropdown', 'select'].includes(ele.type)) {
        nestedFields[ele.name].options = nestedFields[ele.name].allowedValues?.values;
        nestedFields[ele.name].multiple = nestedFields[ele.name].multipleValues? true : false;
      }
    })
    return nestedFields;
  }


  getWizardItemFromFormConfig(formConfig:any, component:any){
    this.wizard = [];
    if(formConfig?.children?.length){     
      this.getWizardSections(formConfig,component);
      if (this.wizard.length) {
        this.wizard[0].styleClass = 'wizard-active';
        this.wizard.splice(-1);
      }
    
      if (this.wizard.length) {
        this.wizard.unshift({
          label: this.translateService.instant('SECTION'),
          disabled: true
        }, {
          separator: true
        });
      }
    }
    return this.wizard
  }
  
  getWizardSections(formConfig:any,component:any){
      formConfig.children.forEach((config: any, index: number) => {
      if(config.children){
        this.getWizardSections(config,component);
      }
        if (config.type === 'formSection') {
        this.wizard.push({
            id: config.label,
            label: this.translateService.instant(config.label),
            command: component.onWizardClick.bind(component)
          }, {
            separator: true
          });
        }
      });
  }


  configureValidators(detailFormControls: FormGroup, formFieldConfig: any) {
    for (let field in formFieldConfig) {
      const fielConfig = formFieldConfig[field];
      if (fielConfig?.uiType?.toUpperCase() == 'EMAIL') {
        detailFormControls.get(field)?.setValidators(Validators.email);
        detailFormControls.get(field)?.updateValueAndValidity();
      }
    }
  }


  public formatDate(date: number, format?: string, locale?: string): string {
    if (typeof date !== 'number') {
      return date;
    }
    format = format || BaseAppConstants.dateFormat;
    locale = locale || BaseAppConstants.defaultLocale;

    return date ? formatDate(date, format, locale) : '';
  }

  public formatDateTime(date: number, format?: string, locale?: string): string {
    format = format || BaseAppConstants.dateTimeFormat;
    locale = locale || BaseAppConstants.defaultLocale;

    return date ? formatDate(date, format, locale) : '';
  }


  public formatNumber(value: number, digitsInfo: string, locale?: string): string {

    locale = locale || BaseAppConstants.defaultLocale;
    return value ? formatNumber(value, locale, digitsInfo) : '';
  }

  public formatCurrency(value: number, currencyCode: string, digitsInfo?: string, currency?: string, locale?: string): string {

    locale = locale || BaseAppConstants.defaultLocale;
    currencyCode = currencyCode || BaseAppConstants.defaultCurrency;
    currency = currency || getCurrencySymbol(currencyCode, 'narrow', locale);

    return value ? formatCurrency(value, locale, currency, currencyCode, digitsInfo) : '';

  }

  public getCurrencySymbol(code: string, format?: string, locale?: string | undefined) {
    locale = locale || BaseAppConstants.defaultLocale;

    return code ? getCurrencySymbol(code, 'narrow', locale) : '';
  }


/// workflow - starts 
  
  getFormSecurityConfigFromSecurityJSON(securityJSON:any, form:FormGroup,actionConfig:any,workflowInfo:any){
    const role = workflowInfo?.actors||[];
    const step =  workflowInfo?.step||'';
    const actions:any =[];
   
    const roleSecurityConf = (securityJSON[role[0]] && securityJSON[role[0]][step]) || {
      hidefields : [],
      enableonlyfields : [],
      disableonlyfields : [],
      enableonlyactions : [],
      disableonlyactions : [],
      hideactions : ['*'],
      showactions:[],
      mandatoryfields : {},
    };
    const formSecurityConfig:any = {
      hidefields : [],
      enableonlyfields : [],
      disableonlyfields : [],
      enableonlyactions : [],
      disableonlyactions : [],
      hideactions : [],
      showactions:[],
      mandatoryfields : {},
    };

    actionConfig.forEach((item:any)=>{
      if(item.type =='buttonGroup'){
           item.children.forEach((k:any)=>{
             actions.push(k.wfAction);
           })
      }
      else if(item.type =='button'){
        actions.push(item.wfAction);
      }
    })

    const workflowActions = this.getActions(role,securityJSON,step,actions);
    const workflowFields  = this.getFields(role,securityJSON,step,form);

    const mergedHideandShowActions = this.merge(workflowActions.hideactions,workflowActions.showactions);
    const mergedenableandDisableActions = this.merge(workflowActions.disableonlyactions,workflowActions.enableonlyactions);

    const mergedHideandShowFields = this.merge(workflowFields.hidefields,workflowFields.showfields);
    const mergedEnableandDisableFields = this.merge(workflowFields.disableonlyfields,workflowFields.enableonlyfields);

    formSecurityConfig.hideactions = mergedHideandShowActions.arr1;
    formSecurityConfig.showactions = mergedHideandShowActions.arr2;

    formSecurityConfig.disableonlyactions = mergedenableandDisableActions.arr1;
    formSecurityConfig.enableonlyactions = mergedenableandDisableActions.arr2;

    formSecurityConfig.mandatoryfields = workflowActions.mandatoryfields;

    formSecurityConfig.hidefields = mergedHideandShowFields.arr1;
    formSecurityConfig.showfields = mergedHideandShowFields.arr2;

    
    formSecurityConfig.disableonlyfields = mergedEnableandDisableFields.arr1;
    formSecurityConfig.enableonlyfields = mergedEnableandDisableFields.arr2;

    return formSecurityConfig;
  }

  getActions(role: any, json: any, step: any, actions: any) {
    const json1: any = [];
    const json2: any = [];
    const json3: any = [];
    const json4: any = [];
    const json5:any =[];
    const json6:any =[];
    let hideActionsEmpty:boolean = false;
    let disableActionsEmpty:boolean = false;

    const mergedJson: any = {
      enableonlyactions: [],
      disableonlyactions: [],
      hideactions: [],
      showactions: [],
      mandatoryfields: {},
    }
    if (role.length > 0 && json) {
    role?.map((user: string) => {
        let filterdJson = json[user] && json[user][step];

      actions.forEach((action: string) => {
        
        if (filterdJson?.hideactions.includes('*')  || filterdJson?.hideactions.includes(action) || filterdJson?.hideactions.length === 0 
            && this.checkCondition(filterdJson?.showactions, action)) {
          json1.push(action);
        }
        if (filterdJson?.showactions.includes('*')  || filterdJson?.showactions.includes(action) || filterdJson?.showactions.length === 0 
            && this.checkCondition(filterdJson?.hideactions, action)) {
          json2.push(action);
        }
        if (filterdJson?.enableonlyactions.includes('*')  || filterdJson?.enableonlyactions.includes(action) || filterdJson?.enableonlyactions.length === 0 
            && this.checkCondition(filterdJson?.disableonlyactions, action)) {
          json3.push(action);
        }
        if (filterdJson?.disableonlyactions.includes('*')  || filterdJson?.disableonlyactions.includes(action) || filterdJson?.disableonlyactions.length === 0 
            && this.checkCondition(filterdJson?.enableonlyactions, action)) {
          json4.push(action);
        }
        if (filterdJson?.hasOwnProperty(action)) {
            if (!mergedJson.mandatoryfields[action]) {
            mergedJson.mandatoryfields[action] = filterdJson.mandatoryfields[action];
          }
        }
      })
      mergedJson.hideactions.push(json1);
      mergedJson.showactions.push(json2);
      mergedJson.enableonlyactions.push(json3);
      mergedJson.disableonlyactions.push(json4);
    });
    }
    
    actions.forEach((action: string) => {
      if (mergedJson.hideactions.flat().length <= 0 && mergedJson.showactions.flat().length <= 0) {
        hideActionsEmpty = true;
        mergedJson.hideactions = mergedJson.hideactions.flat();
        json5.push(action);
      }
      if (mergedJson.enableonlyactions.flat().length <= 0 && mergedJson.disableonlyactions.flat().length <= 0) {
        disableActionsEmpty = true;
        mergedJson.disableonlyactions = mergedJson.disableonlyactions.flat();
        json6.push(action)
      }
    })
    if(hideActionsEmpty || disableActionsEmpty){
      mergedJson.hideactions.push(json5);
      mergedJson.disableonlyactions.push(json6);
    }
     
    
      

    return mergedJson;
  }

  getFields(role: any, json: any, step: any, form: any){
    const json1: any = [];
    const json2: any = [];
    const json3: any = [];
    const json4: any = [];
    const json5:any =[];
    let disableFieldsEmpty:boolean = false;

    const mergedJson: any = {
      hidefields : [],
      showfields:[],
      enableonlyfields : [],
      disableonlyfields : [],
    }
    role?.map((user: string) => {
     
        let filterdJson = json[user] && json[user][step];
        for (const field in form.controls) {
        if (filterdJson?.hidefields.includes('*')  || filterdJson?.hidefields.includes(field) ||  
            filterdJson?.hidefields.length === 0 && this.checkCondition(filterdJson?.showfields, field)) {
          json1.push(field);
        }
        if (filterdJson?.showfields.includes('*')  || filterdJson?.showfields.includes(field) || 
            filterdJson?.showfields.length === 0 && this.checkCondition(filterdJson?.hidefields, field)) {
          json2.push(field);
        }
        if (filterdJson?.enableonlyfields.includes('*')  || filterdJson?.enableonlyfields.includes(field) ||  
            filterdJson?.enableonlyfields.length === 0 && this.checkCondition(filterdJson?.disableonlyfields, field)) {
          json3.push(field);
        }
 
        if (filterdJson?.disableonlyfields.includes('*')  || filterdJson?.disableonlyfields.includes(field) ||  
            filterdJson?.disableonlyfields.length === 0 && this.checkCondition(filterdJson?.enableonlyfields, field)) {
          json4.push(field);
        }
      }
      mergedJson.hidefields.push(json1);
      mergedJson.showfields.push(json2);
      mergedJson.enableonlyfields.push(json3);
      mergedJson.disableonlyfields.push(json4);
    });

    for (const field in form.controls) {
      if (mergedJson.enableonlyfields.flat().length <= 0 && mergedJson.disableonlyfields.flat().length <= 0) {
        disableFieldsEmpty = true;
        mergedJson.disableonlyfields = mergedJson.disableonlyfields.flat();
        json5.push(field);
      }
    }
    if (disableFieldsEmpty) {
      mergedJson.disableonlyfields.push(json5);
    }
     
    return mergedJson;
  }

  checkCondition(data:string[],name:string){
     return (data.length > 0 && !data?.includes(name) && !data.includes('*'))
  }

  merge(arr1:any,arr2:any){
    let json1:any =[];
    let json2:any=[];
    json1 = this.intersectJson(arr1);
    json2 = arr2?.flatMap((a: any) => a);
    return{
      arr1:this.filterBasedonPriority(json2,json1),
      arr2:json2
    }
  }

  intersectJson(arr1: any) {
    if(!arr1.length) return [];
    const formattedArray = arr1?.shift().filter(function (v: any) {
      return arr1.every(function (a: any) {
        return a.indexOf(v) !== -1;
      });
    });
    return formattedArray
  }

  filterBasedonPriority(firstPriority:any[],secondPriority:any[]){
    const filterd:any =[]
    secondPriority?.forEach((action:string)=>{
      if(!firstPriority.includes(action)){
        filterd.push(action);
      }
    })
    return filterd;
  }


  /// workflow - ends 

  getPageUrl(pageUrl: any,json?:any) {
    // console.log(json)
    // if(json.children1){
    //   pageUrl = '/tabs'+pageUrl;
    // }
    if (pageUrl) {
      let index = pageUrl?.indexOf('/')
      let currPath = pageUrl.substr(index)
      return "#" + currPath
    } else {
        return null
    }
  }

  formatTableConfig(config: any) {
    return config?.reduce((acc1: any, curr1: any) => {
      if (curr1?.allowedValues) {
        // const allowedValues = JSON.parse(curr1.allowedValues);
        const allowedValues = curr1.allowedValues;
        curr1.options = allowedValues.values;
        let count = 0;
        curr1.conditionalStyling = allowedValues.conditions?.conditions?.reduce((acc2: any, curr2: any) => {
          const identifierKey = (curr2.id.replace(/ /g,"_")).toUpperCase();
          curr2.query.rules.map((con:any)=>{
            con.value
          })
          for(var i=0;i<curr2.query.rules.length;i++){
            curr2.query.rules[i].value = (curr2.query.rules[i].value.replace(/ /g,"_")).toUpperCase();
          }
          acc2[identifierKey] = curr2;
          acc2[identifierKey].class = 'condition-' + count;

          count++;
          return acc2;

        }, {})
      }
      acc1.push(curr1)
      return acc1;
    }, [])

  }

  
  getTableRequestParams(tableConfig: any): void {
    const params: any = {};
    params.start = 0;
    params.length = tableConfig.pageSize || BaseAppConstants.defaultPageSize;

    params.search = {};
        params.columns = [];
    for (const col of tableConfig.children) {
      const column: any = {};
      column.data = col.data;
      column.name = col.name;
      column.searchable = true;
      column.orderable = col.orderable = true;

      column.search = {};
      params.columns.push(column);
    }
    params.columns.order = [];

    return params;
  }

  createNotificationList(messages:string[]){
    let $listElem:any = '';
    if(messages.length > 1){
      $listElem = $('<ul>').addClass('list-messages');
      messages.forEach(item => {
        $listElem.append($('<li>').addClass('list-messages-item').text(item))
      });

    }else{
      $listElem = $('<div>')
        .addClass('list-messages-item')
        .append($('<span>').addClass('list-messages-item').text(messages[0] || ''))
    }

    return $('<div>').append($listElem).html()

  }

  frameAttachmentURL(field:string, isLocal = false){
    const baseURL = isLocal ?  BaseAppConstants.localFilePath : BaseAppConstants.attachmentBaseURL
    return !field ? '' : baseURL + field;
  }
  createImagePreviewURL(files:[{fileName:string, id:string, file?:any}]){
    const responseFiles:any = [];
    files.forEach(file => { 
      responseFiles.push({
        previewSrc : this.frameAttachmentURL(file.id),
        id: file.id,
        fileName: file.fileName,
        file : file.file || file
      })
    })
    return responseFiles;
  }

  setImagePreview(files:File[]):Observable<any>{
    const ObserGroup:any=[]
    const obsr$ = new Subject<any>();
      if(files && files.length) {
        for (const file of files) {
          ObserGroup.push(this.readImage(file));
      }
      forkJoin(ObserGroup).subscribe((res:any)=>{obsr$.next(res);obsr$.complete();})
      }
      else{
        setTimeout(()=>{
          obsr$.next([])
          obsr$.complete();
        },10)
      }
    return obsr$.asObservable();
  }


  readImage(file:File):Observable<any>{
    const obsr$ = new Subject<any>();
    const reader = new FileReader();
    reader.readAsDataURL(file);        
    reader.onloadend = () => {
        obsr$.next({
          previewSrc : reader.result as string,
          fileName: file.name,
          file : file
        });
        obsr$.complete(); 
    };
    return obsr$.asObservable();
  }


  evaluateListConditions(key: any, value: any, operator: string){
    let result: boolean;
    switch (operator) {
      case '==':
      case'=':
        result = (key == value);
        break;
      case '!=':
        result = (key != value);
        break;
      case '&&':
      case "and":
        result = (key && value);
        break;
      case '||':
      case "or":
        result = (key || value);
        break;
      default:
        result = false;
    }
    return result;
  }

  evaluvateCondition(rules: any, condition: any, formData?: any, fieldConfig?: any) {

    const data: any = formData;
    const currentUserData = this.appGlobalService.get('currentUser');

    let valueConfig: any = {
      lhsConfig:{},
      rhsConfig1:{},
      rhsConfig2:{}
    }
    
    const val = rules?.reduce((acc: boolean, curr: any) => {
      const isParentCondtion = curr.hasOwnProperty("condition");

      if (acc === undefined) 
        acc = (condition === 'and') ? true : false;
      if (isParentCondtion) {
        const currentCondition = curr.condition;
        acc = this.evaluate(acc, this.evaluvateCondition(curr.rules, currentCondition, data,fieldConfig), condition, valueConfig)
      }
      else if(data){
          const lhs = this.getLHsValue(curr,data,currentUserData,fieldConfig);
          const lhsValue = lhs.value;
          valueConfig.lhsConfig = lhs.config;
          const rhs = this.getRHSValue(curr,data,currentUserData,fieldConfig); 
          const rhsValue = rhs.value;
          valueConfig.rhsConfig1 = rhs.config.rhsConfig1;
          valueConfig.rhsConfig2 = rhs.config.rhsConfig2;     
          const operator = curr.operator;
          acc = this.evaluate(acc, this.evaluate(lhsValue, rhsValue, operator, valueConfig), condition, valueConfig); 
      }
      else 
        acc = false;
      return acc;
    }, undefined)

    return val
  }


  getLHsValue(curr: any, data: any, currentUserData: any, fieldConfig: any) {
    let lhsValue: any;
    let config: any
    if (curr.lhsTableName != 'currentUser') {
      lhsValue = data[curr.label]
    }
    else if (curr.lhsTableName === 'currentUser' && curr.label === 'role') {
      const roles = [];
      for (const field in currentUserData) {
        if (currentUserData[field] == true && field !== 'recDeleted') {
          roles.push(field);
        }
      }
      lhsValue = roles;
    }
    else {
      lhsValue = currentUserData[curr.label]
    }
    config = (curr.label === 'role' && curr.lhsTableName === 'currentUser') ? { uiType: 'checkboxgroup' } :
      ((curr.label === 'createdDate' || curr.label === 'modifiedDate') && curr.lhsTableName === 'currentUser') ? { fieldType: 'Date' } :
        fieldConfig[curr.label];

    return {
      value: lhsValue,
      config: config
    }
  }


  getRHSValue(curr: any, data: { [x: string]: any; }, currentUserData: { [x: string]: any; },fielConfig:any) {
    let rhsValue = {};
    let config:any ={};
    switch (curr.type) {

      case 'value':
        rhsValue = {
          value1: curr.value1,
          value2: curr.value2
        }
        break;
      case 'field':
        if (curr.rhsTableName1) {
          rhsValue = {
            value1: ((curr.rhsTableName1 != 'currentUser') ? data[curr.value1] || '' :
              currentUserData[curr.value1] || ''),

            value2: ((curr.rhsTableName1 != 'currentUser') ? data[curr.value2] || '' :
              currentUserData[curr.value2] || '')
          }
         config = {rhsConfig1:fielConfig[curr.value1],rhsConfig2:fielConfig[curr.value2]}
        }

        break;
      case 'field_value':
        rhsValue = {
          value1: (curr.rhsTableName1 === 'currentUser') ? currentUserData[curr.value1] || '' : data[curr.value1] || '',
          value2: curr.value2
        }
        config = {rhsConfig1:fielConfig[curr.value1], rhsConfig2:''}

        break;

      case 'value_field':
        rhsValue = {
          value1: curr.value1,
          value2: (curr.rhsTableName2 === 'currentUser') ? currentUserData[curr.value2] || '' : data[curr.value2] || '',
        }

        config = {rhsConfig1:'',rhsConfig2:fielConfig[curr.value2]}
        break;
    }
    return {value:rhsValue,
            config:config}
  }

  evaluate(key: any, values: any, operator: string,fieldType?:any) {
    let result: boolean = false;
    if(fieldType){
      const value1 = (typeof values === 'object')? values?.value1 : values;
      const value2 = values?.value2;
      switch (operator) {
        case "and":
          result = (key && value1);
          break;
  
        case "or":
          result = (key || value1);
          break;
  
        default:
          result = this.evaluateOperators(key, value1, value2, operator,fieldType);
      }
      return result;
    }
    else{
       return result = this.evaluateListConditions(key,values,operator);
    }
   
  }


  getAutoSuggestValues(valueConfig:any,value:any,primaryKey:any){let values: any[] = [];

    if (valueConfig.multipleValues && !environment.prototype) {
      let keys: any[] = [];
      value?.map((o: { value: { [x: string]: any; }; }) => {
        keys = []
        primaryKey?.map((k: any) => {
          keys.push(o.value[k])
        },
          values.push(keys.join("_")))
      });
    }
    else if(!valueConfig.multipleValues && !environment.prototype){
      primaryKey.map((o: string) => values.push(value.value[o]));
    }
    else{
      values = [...value];
    }
    
    return values;
   
  }


  evaluateOperators(key: any, value1: any, value2: any, operator: any, valueConfig: any) {
    let result: boolean = false;

    if (valueConfig?.lhsConfig?.uiType === 'autosuggest') {
     
      const lhsPrimaryKey = valueConfig.lhsConfig.functionalPrimaryKey || [];
      const rhsPrimaryKey = valueConfig.rhsConfig1?.functionalPrimaryKey || [];

      const lhsValues = this.getAutoSuggestValues(valueConfig.lhsConfig,key,lhsPrimaryKey) ||[];
      const rhsValues = rhsPrimaryKey.length > 0 ? this.getAutoSuggestValues(valueConfig.lhsConfig,value1,rhsPrimaryKey) ||[]: value1;

      result = valueConfig.lhsConfig.multipleValues? this.arrayOperations(lhsValues, rhsValues, operator):this.stringOperations(lhsValues.join(), rhsValues.join(), operator);
     
    }
    else if (valueConfig.lhsConfig?.fieldType === 'number') {
      result = this.numberOperations(key, value1, value2, operator);
    }
    else if (valueConfig.lhsConfig?.fieldType === 'Date') {
      result = this.dateOperations(key, value1, value2, operator);
    }
    else if (valueConfig.lhsConfig?.uiType === 'select' && (valueConfig.lhsConfig.multipleValues) || valueConfig.lhsConfig?.uiType === 'checkboxgroup') {
      result = this.arrayOperations(key, value1, operator);
    }
    else {
      if(valueConfig.rhsConfig1?.uiType === 'autosuggest'  && !environment.prototype){
        const rhsPrimaryKey = valueConfig.rhsConfig1?.functionalPrimaryKey || [];
        const rhsValues = this.getAutoSuggestValues(valueConfig.rhsConfig1,value1,rhsPrimaryKey);
        value1 = (valueConfig.rhsConfig1.multipleValues)?rhsValues:rhsValues.join("_");
    }
      result = this.stringOperations(key, value1, operator);
    }

    return result;

  }

  arrayOperations(key: any, value: any, operator: string) {
    key = key === ''? []:key;
    let result: boolean = false;
    switch (operator) {
      case 'is equal to':
        if (Array.isArray(key) && Array.isArray(value))
          result = (key?.join() === value?.join());
        break;
      case 'is not equal to':
        if (Array.isArray(key) && Array.isArray(value))
          result = (key?.join() !== value?.join());
        break;

      case 'is empty':
        result = ( key == null || key === undefined || key.length == 0 )
        break;

      case 'is not empty':
        result = (key?.length > 0)
        break;
      
      case 'has none of':
        result = (key?.every((val: any) => !value?.includes(val)));
        break;

      case 'has all of':
        result = key?.every((elem: any) => value?.includes(elem));
        break;
      
      case 'has any of':
        result = key?.some((elem: any) => value?.includes(elem));
        break;
    }
    return result;
  }

 
  stringOperations(key: any, value: any, operator: string) {
    let result: boolean = false;
    switch (operator) {

      case 'is equal to':
        result = (key === value);
        break;

      case 'is not equal to':
        result = (key !== value);
        break;

      case 'is empty':
        result = key === '' || key === null || key === undefined;
        break;

      case 'is not empty':
        result = key != '' && key !==null && key !== undefined;
        break;

      case 'is in':
      case 'has any of':
        result = value.includes(key);
        break;

      case 'is not in':
      case 'has none of':
        result = !value.includes(key);
        break;
    }
    return result;
  }

  dateOperations(key: any, value1: any, value2: any, operator: string) {
    let result: boolean = false;
    key = new Date(key)?.getTime();
    value1 = new Date(value1)?.getTime();
    value2 = new Date(value2)?.getTime()
    switch (operator) {

      case 'is equal to':
        result = key === value1;
        break;

      case 'is before':
        result = (key < value1);
        break;

      case 'is after':
        result = (key > value1);
        break;

      case 'is equal or before':
        result = (key <= value1);
        break;

      case 'is equal or later than':
        result = (key >= value1);
        break;

      case 'is empty':
        result = key === '';
        break;

      case 'is not empty':
        result = key;
        break;

      case 'is between':
        result = value1 < key && value2 > key;
        break;

      case 'is not between':
        result = value1 > key || value2 < key;
        break;

    }

  return result;

  }
  numberOperations(key: any, value1: any, value2: any, operator: string) {
    let result: boolean = false;
    switch (operator) {
      case 'is equal to':
        result = (key === value1);
        break;
      case 'is not equal to':
        result = (key !== value1);
        break;
      case 'is less than':
        result = (key < value1);
        break;
      case 'is greater than':
        result = (key > value1);
        break;
      case 'is less than or equal to':
        result = (key <= value1);
        break;
      case 'is greater than or equal to':
        result = (key >= value1);
        break;
      case 'is between':
        result = (value1 < key && value2 > key);
        break;
      case 'is not between':
        result = (value1 > key || value2 < key);
        break;
    }
    return result;

  }
  
  formatRawDatatoRedableFormat(config:any, data:any){
    const type = config.uiType;
    let formattedValue: any;
    switch (type) {
      case 'date':
        formattedValue = this.formatDate(data,'');
        break;

      case 'datetime':
        formattedValue = this.formatDateTime(data, '');
        break;

      case 'currency':
        formattedValue = this.formatCurrency(data, '', '');
        break;

      case 'number':
        formattedValue = this.formatNumber(data,'');
        break;
        
      case 'autosuggest':
        formattedValue = (environment.prototype)? data : (config.multipleValues === true)? 
        ((data && data?.map((o: { [x: string]: any; })=> o[config.displayField])) || []).toString():
        (data && data[config.displayField]);
        break;

      case 'dropdown':
      case 'select':
        formattedValue = (config.multipleValues === true)?
          (data && data?.map((o:any)=>this.translateService.instant((o.replace(/ /g,"_")).toUpperCase())) || []).toString() :
          data && this.translateService.instant((data?.replace(/ /g,"_")).toUpperCase());
        break;

        case 'checkbox':
          if(typeof data != 'undefined'){
          if(config.fieldType == 'Boolean'){          
            formattedValue = data ? 'True' : 'False';
          }
        }
        break;


      default:
        formattedValue = data;
    }
    return (formattedValue);
  }

  generateDynamicQueryParams(urlObj: any) {
    let queryParams = new HttpParams();

    urlObj.colConfig?.filterInputMapping?.map((paramsObj: any) => { 
      const fieldName = paramsObj.tableField.split('.');
      const value:any = urlObj.colConfig?.uiType === 'autosuggest'? urlObj.value[paramsObj.tableField]: urlObj[paramsObj.tableField];
      queryParams = queryParams.append(paramsObj.lookupField, value);
    })

    queryParams = queryParams.append('query',urlObj.searchText || '');
    queryParams = queryParams.append('pgNo',urlObj.pageNo);
    queryParams = queryParams.append('pgLen',BaseAppConstants.defaultPageSize);

    const url = `${urlObj.url}?${queryParams}`;
    return url;
  }   

  getActionsConfig(config: any) {
    return config?.flatMap((o: any) => {
      if (o.type === 'button') {
        return o;
      }
      else if (o.type === 'buttonGroup')
        return o.children
    })
  }

}

