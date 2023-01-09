import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VgClassDirective } from './vgClass.directive';
import { VgStyleDirective } from './vgStyle.directive';

@NgModule({
  declarations: [
    VgClassDirective,
    VgStyleDirective
  ],
  imports: [
    CommonModule,
    
  ],
  exports:[
    VgClassDirective,
    VgStyleDirective
  ]
})
export class DirectiveModule { }
