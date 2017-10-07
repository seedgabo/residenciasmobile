import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewVisitPage } from './new-visit';
@NgModule({
  declarations: [NewVisitPage],
  imports: [
    IonicPageModule.forChild(NewVisitPage)
  ],
})
export class NewVisitPageModule { }
