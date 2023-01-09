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
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ElementRef, Renderer2, ViewChild } from '@angular/core';
import { allowedValuesValidator } from '@baseapp/widgets/validators/allowedValuesValidator';
import { fromEvent, Subscription, map } from 'rxjs';
import { environment } from '@env/environment';
import { Filter } from '@baseapp/vs-models/filter.model';
import { BaseAppConstants } from '@baseapp/app-constants.base';

@Directive(
{
	providers:[MessageService, ConfirmationService, DialogService]
}
)
export class ApplicationUserListBaseComponent{
	
	
	isSearchFocused:boolean = false;
showBreadcrumb = BaseAppConstants.showBreadcrumb;
	
showAdvancedSearch: boolean = false;

tableSearchFieldConfig:any = {};
@ViewChild('toggleButton')
  toggleButton!: ElementRef;
  @ViewChild('menu')
  menu!: ElementRef;

	quickFilter: any;
hiddenFields:any = {};
quickFilterFieldConfig:any={}
	selectedValues!: [];
  filter: Filter = {
    globalSearch: '',
    advancedSearch: {},
    sortField: null,
    sortOrder: null,
    quickFilter: {}
  };
params: any;
isMobile: boolean = BaseAppConstants.isMobile;

  gridData: ApplicationUserBase[] = [];
  totalRecords: number = 0;
  subscriptions: Subscription[] = [];
  formattableElements:any = ['date','datetime','number','currency','string'];
 multiSortMeta:any =[];
 selectedColumns:any =[];
 readonly GRID_ELEMENTS: any = {
    AUTOCOMPLETE: 'autocomplete',
    DATE: 'date',
    DATETIME: 'datetime',
    DROPDOWN: 'dropdown',
    NUMBER: 'number',
    STRING: 'string',
    ICON: 'icon',
    IMAGE: 'image',
    BOOLEAN: 'Boolean',
    TAG: 'tag',
    CURRENCY: 'currency',
    LINK: 'link'
  };

subHeader: any;
  autoSuggest: any;
  query: any;

rightFreezeColums:any;
total:number =0;
inValidFields:any = {};
selectedItems:any ={};
scrollTop:number =0;
isRowSelected: boolean = false;
isPrototype = environment.prototype;
  workFlowEnabled = false;
isList = true;
isPageLoading:boolean = false;
autoSuggestPageNo:number = 0;
complexAutoSuggestPageNo:number = 0
localStorageStateKey = "application-user-list";
showMenu: boolean = false;
conditionalActions:any ={
  disableActions:[],
  hideActions:[]
}
	bsModalRef?: BsModalRef;
	isChildPage:boolean = false;

	
	leftActionBarConfig : any = {
  "children" : [ {
    "outline" : "true",
    "label" : "BUTTON_GROUP",
    "type" : "buttonGroup",
    "children" : [ {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "action" : "new",
      "buttonEnabled" : "yes",
      "label" : "NEW",
      "type" : "button"
    }, {
      "outline" : "true",
      "buttonType" : "icon_on_left",
      "visibility" : "show",
      "showOn" : "both",
      "buttonStyle" : "curved",
      "action" : "delete",
      "buttonEnabled" : "yes",
      "label" : "DELETE",
      "type" : "button"
    } ],
    "buttonStyle" : "curved"
  }, {
    "outline" : "true",
    "buttonType" : "icon_on_left",
    "visibility" : "show",
    "showOn" : "both",
    "buttonStyle" : "curved",
    "icon" : {
      "type" : "icon",
      "icon" : {
        "label" : "fas fa-sync",
        "value" : "fas fa-sync"
      },
      "iconColor" : "#000000",
      "iconSize" : "13px"
    },
    "action" : "refresh",
    "buttonEnabled" : "yes",
    "label" : "REFRESH",
    "type" : "button"
  } ]
}
	rightActionBarConfig : any = {
  "children" : [ ]
}
	tableSearchConfig : any = {
  "children" : [ {
    "label" : "EMAIL",
    "data" : "",
    "field" : "email",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "email",
    "timeOnly" : false,
    "uiType" : "email",
    "name" : "email",
    "fieldName" : "email"
  }, {
    "label" : "FIRST_NAME",
    "data" : "",
    "field" : "firstName",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "firstName",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "firstName",
    "fieldName" : "firstName"
  }, {
    "label" : "LAST_NAME",
    "data" : "",
    "field" : "lastName",
    "type" : "searchField",
    "fieldType" : "string",
    "fieldId" : "lastName",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "lastName",
    "fieldName" : "lastName"
  } ],
  "columns" : "2",
  "type" : "tableSearch",
  "showAdvancedSearch" : true
}
	quickFilterConfig : any = {
  "children" : [ ]
}
	tableConfig : any = {
  "recordSelection" : "multiple_records",
  "rightFreezeFromColumn" : "0",
  "infiniteScroll" : "true",
  "viewAs" : "list",
  "hoverStyle" : "box",
  "tableStyle" : "style_1",
  "type" : "grid",
  "showDetailPageAs" : "navigate_to_new_page",
  "leftFreezeUptoColumn" : "0",
  "pageLimit" : "30",
  "rememberLastTableSettings" : "true",
  "children" : [ {
    "label" : "EMAIL",
    "data" : "",
    "field" : "email",
    "type" : "gridColumn",
    "width" : "120px",
    "showOnMobile" : "true",
    "showLabel" : "false",
    "fieldType" : "string",
    "fieldId" : "email",
    "timeOnly" : false,
    "uiType" : "email",
    "name" : "email",
    "fieldName" : "email"
  }, {
    "label" : "FIRST_NAME",
    "data" : "",
    "field" : "firstName",
    "type" : "gridColumn",
    "width" : "120px",
    "showOnMobile" : "true",
    "showLabel" : "false",
    "fieldType" : "string",
    "fieldId" : "firstName",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "firstName",
    "fieldName" : "firstName"
  }, {
    "label" : "LAST_NAME",
    "data" : "",
    "field" : "lastName",
    "type" : "gridColumn",
    "width" : "120px",
    "showOnMobile" : "true",
    "showLabel" : "false",
    "fieldType" : "string",
    "fieldId" : "lastName",
    "timeOnly" : false,
    "uiType" : "text",
    "name" : "lastName",
    "fieldName" : "lastName"
  } ],
  "sorting" : "single_column",
  "detailPageNavigation" : "click_of_the_row",
  "resizeMode" : "expand_mode",
  "rowSpacing" : "medium",
  "rowHeight" : "medium"
}
	pageViewTitle: string = 'APPLICATION_USER_LIST';
	
		tableSearchControls : FormGroup = new FormGroup({
	lastName: new FormControl('',[]),
	firstName: new FormControl('',[]),
	email: new FormControl('',[]),
});

		quickFilterControls : FormGroup = new FormGroup({
});


	constructor(public applicationUserService: ApplicationUserService, public appUtilBaseService: AppUtilBaseService, public translateService: TranslateService, public messageService: MessageService, public confirmationService: ConfirmationService, public dialogService: DialogService, public domSanitizer: DomSanitizer, public bsModalService: BsModalService, public activatedRoute: ActivatedRoute, public renderer2: Renderer2, public router: Router, ...args: any) {
    
 	 }

	
	getDisabled(formControl: FormGroup, ele: string) {
  const parent = ele.split('?.')[0];
  if (formControl.controls[parent] instanceof FormGroup){
    return formControl.get(ele)?.disabled
  }
  else
    return formControl.controls[parent].disabled;
}
	clearFilterValues() {
  this.tableSearchControls.reset();
  this.filter.advancedSearch = {};
  this.onRefresh();
}
	conditionalFormatting(config: any, data: any) {
   if(config?.hasOwnProperty([data])){
    const query = config[data].query
    const initialCondition = true;
    const finalCondition = query.condition === 'and' ? '&&' : '||';
    const conditions: any[] = [];
    query.rules?.forEach((rule: any) => {
      conditions.push(this.appUtilBaseService.evaluate(data, rule.value, rule.operator));
    })
    let finalResult = conditions?.reduce((previousValue: any, currentValue: any) =>
      this.appUtilBaseService.evaluate(previousValue, currentValue, finalCondition), initialCondition);
    return finalResult;
   }
   else{
     return false;
   }
}
	clearAllFilters() {
  this.filter.globalSearch = '';
  this.clearFilterValues();
}
	setHeight() {
  setTimeout(() => {
    const el = (<HTMLInputElement>document.getElementById("table-container")).getBoundingClientRect();
    const top = el.top + 'px';
    (<HTMLInputElement>document.getElementById('table-container')).style.setProperty('height', 'calc(100vh - ' + top + ')');
  }, 100);
 
}
	onDelete() {
  if (this.selectedValues.length > 0) {
    let values: any = [];
	this.selectedValues.forEach((field: any) => {
		values.push(field.sid)
	});
	let requestedParams:any = {ids:values.toString()}
      this.confirmationService.confirm({
        message: this.translateService.instant('DELETE_CONFIRMATION_MESSAGE'),
        header: 'Confirmation',
        icon: 'pi pi-info-circle',
        accept: () => {
          this.applicationUserService.delete(requestedParams).subscribe((res: any) => {
            this.showToastMessage({severity:'success', summary:'', detail:this.translateService.instant('RECORDS_DELETED_SUCCESSFULLY')});
            requestedParams = {};
            this.selectedValues = [];
            this.onRefresh();
            
          });
        },
        reject: () => {
          //rejected
        },
      });
    }

  }
	getSubHeader() {
this.subHeader = this.tableConfig.groupOnColumn?.name?.split('.');
}
	saveColumns() {
    let columns = document.querySelectorAll('.tbl-ctx-menu input:checked')
    let columnsToShow: string[] = [];
    columns.forEach((e: any) => {
      columnsToShow.push(e.value);
    });
    let matColumnOrder: any = this.getValueFromLocalStorage(this.localStorageStateKey) || {};
    matColumnOrder['columnOrder'] = columnsToShow;
    localStorage.setItem(this.localStorageStateKey, JSON.stringify(matColumnOrder));
    let cols = this.tableConfig.children;
    cols = cols.filter((e: any) => columnsToShow.includes(e.field));
    if (matColumnOrder.columnOrder) {
      let sortingArr = matColumnOrder.columnOrder || [];
      cols.sort(function (a: any, b: any) {
        return sortingArr.indexOf(a) - sortingArr.indexOf(b);
      });
    }
    this.selectedColumns = cols;
    this.showMenu = false;
  }
	actionBarAction(btn: any) {
    const methodName: any = (`on` + btn.action.charAt(0).toUpperCase() + btn.action.slice(1));
    let action: Exclude<keyof ApplicationUserListBaseComponent, ' '> = methodName;
    if (btn.action === 'navigate_to_page' && btn.pageName?.url) {
      this.router.navigateByUrl(btn.pageName.url);
    }
    else if (typeof this[action] === "function") {
      this[action]();
    }
  }
	attachInfiniteScroll() {
const tracker = (<HTMLInputElement>document.getElementsByClassName('p-datatable-wrapper')[0])
let windowYOffsetObservable = fromEvent(tracker, 'scroll').pipe(map(() => {
  return Math.round(tracker.scrollTop);
}));

const scrollSubscription = windowYOffsetObservable.subscribe((scrollPos: number) => {
  if(this.scrollTop != scrollPos){
        this.scrollTop = scrollPos;
    if ((tracker.offsetHeight + scrollPos >= tracker.scrollHeight)) {
      this.params.start = this.total;
     this.loadGridData();
   }
  }
});
this.subscriptions.push(scrollSubscription);
}
	filterSearch() {
    this.quickFilterControls.valueChanges.subscribe((value) => {
      let dateRangeNotChoosen: boolean = false;
      for (let control of this.quickFilterConfig.children) {
        if (control.fieldType === 'Date') {
          if (value[control.field][0] && !value[control.field][1]) {
            dateRangeNotChoosen = true;
            break;
          }
        }
      }
      if (!dateRangeNotChoosen) {
        this.filter.quickFilter = value;
       this.onRefresh();
      }
    });
  }
	clearColumnReorder() {
    setTimeout(() => {
      this.selectedColumns = this.tableConfig.children;
      localStorage.removeItem(this.localStorageStateKey);
      this.showMenu = false;
    }, 10);
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
	advancedSearch() {
    this.filter.advancedSearch = this.tableSearchControls.value;
    let hasDates = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "date" || e.fieldType.toLowerCase() == "datetime");
    if (hasDates.length > 0) {
      hasDates.forEach((f: any) => {
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && Array.isArray(value)) {
          let val = { lLimit: value[0].getTime(), uLimit: value[1] ? value[1].getTime() : value[1], type: "Date" }
          this.filter.advancedSearch[field] = val;
          if (value[0] == null && value[1] == null) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    let hasNumbers = this.tableSearchConfig.children.filter((e: any) => e.fieldType.toLowerCase() == "number" || e.fieldType.toLowerCase() == "double");
    if (hasNumbers.length > 0) {
      hasNumbers.forEach((f: any) => {
        let field = f.name;
        let value = this.filter.advancedSearch[field];
        if (value && !Array.isArray(value)) {
          this.filter.advancedSearch[field] = {
            lLimit: value.min, uLimit: value.max, type: "Number"
          }
          if (value.min == null && value.max == null) {
            delete this.filter.advancedSearch[field];
          }
        }
      });
    }
    this.onRefresh();
    this.toggleAdvancedSearch();
  }
	// closeAdvancedSearchPopup() {
  //   this.renderer2.listen('window', 'click', (e: Event) => {
  //     let clickedInside = this.menu?.nativeElement.contains(e.target);
  //     if(e.target !== this.toggleButton?.nativeElement&& !clickedInside &&this.showAdvancedSearch){
  //       this.showAdvancedSearch = false;
  //     }
  //   );
  // }
clearFilters(){
  this.filter.globalSearch = '';
  this.isSearchFocused = false;
}

focus(){
  this.isSearchFocused = !this.isSearchFocused;
}
	initSearchForm(){
  this.tableSearchFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.tableSearchConfig)
}
	getSearchData(searchFields: any, config: any) {
    let searchData: any = {}
    for (const key in searchFields) {
      if (searchFields.hasOwnProperty(key) && searchFields[key]?.toString().length) {
       if (this.selectedItems.hasOwnProperty(key)) {
          let lookupObj: any = [];
          if (config[key].multiple) {
            this.selectedItems[key].map((o: any) => lookupObj.push(o.id));
          }
          searchData[`${key}__id`] = config[key].multiple ? lookupObj : this.selectedItems[key][0].id;
        }
        else {
          searchData[key] = searchFields[key];
        }
      }
    }
    return searchData;
  }
	showToastMessage(config: object) {
this.messageService.add(config);
}
	loadGridData() {
 this.isPageLoading = true;
  let gridSubscription: any;
  if (environment.prototype) {
  	gridSubscription = this.applicationUserService.getProtoTypingData().subscribe((data: any) => {
  		this.gridData = [...this.gridData, ...data];
  		 this.isPageLoading = false;
  	});
  } else {
	   const params = this.params;
	   this.filter.sortField = this.tableConfig.groupOnColumn?this.tableConfig.groupOnColumn?.name:this.filter.sortField;
       const searchData = { ...this.getSearchData(this.filter.advancedSearch, this.tableSearchFieldConfig), ...this.getSearchData(this.filter.quickFilter, this.quickFilterFieldConfig) }
	  	if (this.filter.globalSearch)
	  		searchData['_global'] = this.filter.globalSearch;
	  		
	  	if(this.filter.sortField && this.filter.sortOrder){
          params.order = [{
            column: this.filter.sortField,
            dir: this.filter.sortOrder
          }]
        }
        else{
          params.order = null;
        }
	  	
	  	params.search = searchData;
	  	const value:any = "parentId";
	  	let property: Exclude<keyof ApplicationUserListBaseComponent, ''> = value;
	  	const method:any = "getChildTableData";
	  	let action: Exclude<keyof ApplicationUserListBaseComponent, ''> = method;
	  	if(this.isChildPage && typeof this[action] === "function"){
        if (this[property]) {
          params.pid = this[property];
          this[action](params);
        }
        else {
          this.isPageLoading = false;
        }
	  	}
	  	else{
		  	this.applicationUserService.getDatatableData(params).subscribe((data: any) => {
				let updateRecords: ApplicationUserBase[] = [...this.gridData, ...data?.results];
				const ids = updateRecords.map(o => o.sid);
				this.gridData = updateRecords.filter(({ sid }, index) => !ids.includes(sid, index + 1));
				this.denormalize(this.gridData);
				this.total = data?.filtered ? data?.filtered : 0;
				 this.isPageLoading = false;
			},(err:any)=>{
          this.isPageLoading = false;
        });
		}
	}
}
	onFormatColumns(col: any, datum: any) {
    const type = col.uiType;
    let data = datum[col.name];
    let formattedValue: any;
    switch (type) {
      case 'date':
        formattedValue = this.appUtilBaseService.formatDate(data, col.format ? col.format : null);
        break;

      case 'datetime':
        formattedValue = this.appUtilBaseService.formatDateTime(data, col.format ? col.format : null)
        break;

      case 'currency':
        const ccode = col.currencyCode ? col.currencyCode : null;
        const cDigits = col.currencyDigits ? col.currencyDigits : null;
        formattedValue = this.appUtilBaseService.formatCurrency(data, ccode, cDigits);

        break;

     case 'number':
        formattedValue = data;
        break;
        
      case 'autosuggest':
        formattedValue = (environment.prototype)? data : (data?.value)? (data?.value[col.displayField]):' ';
        break;

      default:
        formattedValue = (Array.isArray(data))? data.toString():data;
    }
    return (formattedValue);
  }
	saveReorderedColumns(event: any) {
    let columnOrder = event.columns.map((e: any) => e.field);
    let matColumnOrder: any = this.getValueFromLocalStorage(this.localStorageStateKey) || {};
    matColumnOrder['columnOrder'] = columnOrder;
    localStorage.setItem(this.localStorageStateKey, JSON.stringify(matColumnOrder));
    this.selectedColumns = JSON.parse(JSON.stringify(event.columns));
  }
	openSettings() {
    let matColumnOrder: any = this.getValueFromLocalStorage(this.localStorageStateKey) || {};
    let alreadySelectedCols = matColumnOrder['columnOrder'] || [];
    if (alreadySelectedCols.length > 0) {
      this.tableConfig.children.map((e: any) => e.checked = false);
      this.tableConfig.children.forEach((e: any) => {
        if (alreadySelectedCols.includes(e.field)) {
          e.checked = true;
        }
      });
    } else {
      this.tableConfig.children.map((e: any) => e.checked = true);
    }
    this.showMenu = true;
  }
	onKeydown(event: any) {
  if (event.which === 13 || event.keyCode === 13) {
    // this.filter.globalSearch = this.globalSearch
   this.onRefresh();
  }
}
	onRowSelect(event:any){
    if(this.selectedValues.length > 0){
      this.isRowSelected = true;
    }
    else if(this.selectedValues.length <= 0){
      this.isRowSelected = false;
    }
  }
	sort(e: any, field: string) {
this.filter.sortField = field;
this.filter.sortOrder = (e.currentTarget.childNodes[1].childNodes[0].classList.contains('pi-sort-amount-up-alt')) ? 'desc' : 'asc';
this.onRefresh();
}
	onNew() {
	const value: any = "parentId";
	let property: Exclude<keyof ApplicationUserListBaseComponent, ''> = value;
	if (this.isChildPage && this[property]) {
		const methodName: any = "onNewChild";
		let action: Exclude<keyof ApplicationUserListBaseComponent, ''> = methodName;
		if (typeof this[action] == "function") {
			this[action]();
		}
	}
	else {
		this.router.navigate(['../applicationuserdetail'], { relativeTo: this.activatedRoute});
	}
}
	onUpdate(id: any) {
	if (this.tableConfig.detailPage?.url) {
      const value: any = "parentId";
       let property: Exclude<keyof ApplicationUserListBaseComponent, ''> = value;
       const methodName: any = "onUpdateChild";
       let action: Exclude<keyof ApplicationUserListBaseComponent, ''> = methodName;
       if (this.isChildPage && this[property]) {
	       if (typeof this[action] === "function") {
	        	this[action](id);
	         }
       }
       else {
       	this.router.navigateByUrl(this.tableConfig.detailPage.url + '?id=' + id)
       }
    }
}
	saveResizeColumns(event: any) {
    setTimeout(() => {
      this.selectedColumns.forEach((e: any) => {
        if (e.data == event.element.innerText) {
          e.width = event.element.offsetWidth + 'px';
          localStorage.setItem(this.localStorageStateKey, JSON.stringify(this.selectedColumns));
        }
      });
    }, 10);
  }
	onRefresh(){
this.gridData = [];
this.params.start =0;
this.loadGridData();
}
	toggleAdvancedSearch() {
  this.showAdvancedSearch = !this.showAdvancedSearch;
}
	getClass(){
    const styleClass = (this.isMobile && this.tableConfig.viewAs ==='list') ? 'table-body-md':'table-body';
    return styleClass;
  }
	initFilterForm(){
    this.quickFilterFieldConfig= this.appUtilBaseService.getControlsFromFormConfig(this.quickFilterConfig);
    this.filterSearch();
}
	denormalize(gridData: any) {
}
	cancelColumnOptions() {
    this.showMenu = false;
  }
	onFormatMultipleValues(col: any, data: any): any {
    const arr: any = []
    const displayField = col.displayField ? col.displayField : '';
  if (col.uiType == 'autosuggest' && Array.isArray(data)) {
      data?.forEach((k: any) => {
        arr.push(k.value[displayField]);
      })
    }
    else if (Array.isArray(data)) {
      data.forEach(function (e: any) {
        if (displayField)
          arr.push(e[displayField])
        else
          arr.push(e);
      })
    }
    else if (typeof data === 'object') {
      if (displayField) {
        arr.push(data[displayField]);
      }
    }
    else {
      arr.push(data);
    }
    return (arr.toString());
  }
	clearGlobalSearch(){
  this.filter.globalSearch = '';
  this.onRefresh();
}
	disablechildAction() {
    const value: any = "parentId";
    let property: Exclude<keyof ApplicationUserListBaseComponent, ' '> = value;
    this.leftActionBarConfig?.children?.map((ele:any)=>{
      if(ele.type === 'buttonGroup'){
        ele?.children.map((childEle:any,index:number)=>{
          if (childEle?.action === 'new' && !this[property] && this.isChildPage && childEle.buttonEnabled !='conditional') {
              childEle.buttonEnabled ='no';
            }
          else if(childEle.action === 'new' && this[property] && this.isChildPage && childEle.buttonEnabled !='conditional'){
            childEle.buttonEnabled ='yes';
          }
        })
      }
    })
  }
	getValueFromLocalStorage(key: string) {
    let val = localStorage.getItem(key);
    if (val != null) {
      return JSON.parse(val);
    } else {
      return null;
    }
  }

    onInit() {
		
		this.initSearchForm();

		this.initFilterForm();
		this.tableConfig.children = this.appUtilBaseService.formatTableConfig(this.tableConfig.children);
this.params = this.appUtilBaseService.getTableRequestParams(this.tableConfig);
this.loadGridData();
if (localStorage.getItem(this.localStorageStateKey)) {
      try{
                let columnsToShow = JSON.parse(localStorage.getItem(this.localStorageStateKey) || '{}');
                let cols = this.tableConfig.children;
                if(columnsToShow.columnOrder) {
                  cols = cols.filter((e: any) => columnsToShow.columnOrder.includes(e.field));
                  let sortingArr = columnsToShow.columnOrder;
                  cols.sort(function (a: any, b: any) {
                        return sortingArr.indexOf(a) - sortingArr.indexOf(b);
                  });
                }
                this.selectedColumns = cols;
          }
          catch(e) {
                this.selectedColumns = this.tableConfig.children;
          }
    } else {
      this.selectedColumns = this.tableConfig.children;
    }

this.getSubHeader();
this.rightFreezeColums = (this.tableConfig.children.length - this.tableConfig.rightFreezeFromColumn);
 this.disablechildAction();
    }
	
     onDestroy() {
		
		    this.subscriptions.forEach((subs: { unsubscribe: () => void; }) => subs.unsubscribe());
  
    }
     onAfterViewInit() {
		
		
 this.setHeight();
   setTimeout(() => {
      this.attachInfiniteScroll();
    }, 2000);
  

    }

}
