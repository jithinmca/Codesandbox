import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-caption-bar',
  templateUrl: './caption-bar.component.html',
  styleUrls: ['./caption-bar.component.scss']
})
export class CaptionBarComponent implements OnInit {
  @Input() captionbarConfig:any; 
  data!: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}      

 
  ngOnInit(): void {
  }

  renderHtml(item:any){ 
    if(item.render){
      let html = item.render(item);
      html = this.sanitizer.sanitize(0,html);
      /* OR */
      html = this.sanitizer.bypassSecurityTrustHtml(html);
      return html
    }
    return item.html;
  };

}
