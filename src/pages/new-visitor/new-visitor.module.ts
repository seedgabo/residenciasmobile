import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewVisitorPage } from './new-visitor';

@NgModule({
  declarations: [
    NewVisitorPage,
  ],
  imports: [
    IonicPageModule.forChild(NewVisitorPage),
  ],
  exports: [
    NewVisitorPage
  ]
})
export class NewVisitorPageModule {}
