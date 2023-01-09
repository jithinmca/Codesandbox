import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppGlobalService {

  /** Global service which can be used to store the data that are needed globally. Ex, Current user Info */
  constructor() { }
  public store: any = {};

  public write(property: string, value: any): void {
    this.store[property] = value;
  }

  public get(property: string): any {
    return (this.store[property] ? this.store[property] : '');
  }
}
