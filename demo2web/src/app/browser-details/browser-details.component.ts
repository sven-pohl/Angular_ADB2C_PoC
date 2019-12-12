import { Component, Input, OnInit } from '@angular/core';
import { detect } from 'detect-browser';
import { BrowserDetail } from './enums/browser-detail.enum'

@Component({
  selector: 'dv-browser-details',
  templateUrl: './browser-details.component.html',
  styleUrls: ['./browser-details.component.scss']
})
export class BrowserDetailsComponent implements OnInit {

  browser: any;

  @Input()
  public cssClass: string

  @Input()
  public browserDetails: string[]

  constructor() {
    this.browserDetails = ["name", "version", "os"];
   }

  ngOnInit() {
    this.browser = detect();
    if (this.browser) {
      this.browserDetails.includes("name") ? console.log(this.browser.name) : "";
      this.browserDetails.includes("version") ? console.log(this.browser.version) : "";
      this.browserDetails.includes("os") ? console.log(this.browser.os) : "";
    }
  }
}
