import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { BrowserDetailsComponent } from './browser-details.component'


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        BrowserDetailsComponent,
    ],
    exports: [
        BrowserDetailsComponent,
    ],

})
export class BrowserDetailsModule {}
