import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AppGlobalService } from '@baseapp/app-global.service';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class AppLayoutBaseService {
  private displayMenu = new Subject<boolean>();
  private menuType: string = 'float';
  private displayLeftMenu = new Subject<boolean>();
  private displayRightMenu = new Subject<boolean>();
  constructor(public titleService: Title, public appGlobalService:AppGlobalService) { }

  config : any = {
  "left" : [ {
    "element" : "leftMenu",
    "menuType" : "fixed"
  }, {
    "element" : "logo"
  }, {
    "element" : "appTitle"
  } ],
  "middle" : [ {
    "element" : "leftPane"
  }, {
    "element" : "middlePane"
  }, {
    "element" : "rightPane"
  } ],
  "right" : [ {
    "element" : "user"
  }, {
    "element" : "rightMenu",
    "menuType" : "float"
  }, {
    "element" : "navigationTabs",
    "menuType" : "float"
  } ]
};

  public getLeftMenuVisibility(): Observable<boolean> {
    return this.displayLeftMenu.asObservable();
  }

  public updateLeftMenuVisibility(displayLeftMenu: boolean): void {
    this.displayLeftMenu.next(displayLeftMenu);
  }

  public getRightMenuVisibility(): Observable<boolean> {
    return this.displayRightMenu.asObservable();
  }

  public updateRightMenuVisibility(displayRightMenu: boolean): void {
    this.displayRightMenu.next(displayRightMenu);
  }

  public getMenuType(): string {
    return this.menuType;
  }

  public getTopBarCofiguration() {
    return this.config;
  }

  public getMenuItems() {

    const leftMenu: any = (this.config.left.find((t: { element: string; }) => t.element === "leftMenu"))
    const rightMenu: any = (this.config.right.find((t: { element: string; }) => t.element === "rightMenu"));
    let left = (leftMenu?.children ? leftMenu : false)
    // return (left || rightMenu);
    return { leftMenu: leftMenu, rightMenu: rightMenu }
  }

  public getStyles(item: any) {
    let properties = ['fontsize', 'font-family', 'color', 'background-color', 'height', 'width', 'margin', 'padding'];
    let styleObj: any = {};
    if (item) {
      for (const key in item) {
        if (properties.includes((key.toLowerCase()))) {
          styleObj[key] = item[key];
        }
      }
    }
    return styleObj;
  }

  getConfigData(): Observable<any> {
    const subject: Observable<any> = new Observable(observer => {
      const data = require('base/assets/menu.json');
      observer.next(data as any);
    });
    return subject;
  }
  
  public setAppTitle() {
    let appTitleObj: any = (this.config.left.find((t: { element: string; }) => t.element === "appTitle"))
    if (appTitleObj?.title) {
      this.titleService.setTitle(appTitleObj?.title);
    }
  }
  
  public setAppLogo() {
    let appLogoObj: any = (this.config.left.find((t: { element: string; }) => t.element === "logo"));
    let favIcon: any = document.querySelector('#appLogo');
    if (appLogoObj?.urlIconFileName) {
      favIcon.href = `assets/images/` + appLogoObj.urlIconFileName;
    } else {
      favIcon.href = `assets/images/` + appLogoObj.logoFileName;
    }
  }
getMenu() {
	let menuData: any;
	if (environment.prototype) {
		this.getConfigData().subscribe((response) => {
		menuData = response;
		})
	}
	else {
		let currentUserData = this.appGlobalService.get('currentUser');
		menuData = (currentUserData[0]) ? JSON.parse(currentUserData[0].menuRole) : {}
	}
	menuData = this.customizeMenuContent(menuData);
	return menuData;
}
customizeMenuContent(menu: any) {
    return menu;
  }
}