import { Directive, ElementRef, Input, OnInit } from '@angular/core';
@Directive({
  selector: '[appVgClass]'
})
export class VgClassDirective implements OnInit {

  @Input() appVgClass: any;

  constructor(private el: ElementRef) {

  }

  ngOnInit() {
    
    if (Array.isArray(this.appVgClass)) {
      //['btn','btn-primary','btn-secondary']
      this.el.nativeElement.classList.add(...this.appVgClass)
    }
    else {
      // btn btn-primary btn-secondary
      this.el.nativeElement.className = this.appVgClass;
    }

  }
}

