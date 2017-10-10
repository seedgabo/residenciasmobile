import { NgModule } from '@angular/core';
import {IonicModule} from "ionic-angular";
import { NewsComponent } from './news';

@NgModule({
  declarations: [NewsComponent],
  imports: [IonicModule],
  exports: [NewsComponent]
})
export class NewsComponentModule { }
