import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitsPage } from './visits';

@NgModule({
  declarations: [
    VisitsPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitsPage),
  ],
  exports: [
    VisitsPage
  ]
})
export class VisitsPageModule {}
