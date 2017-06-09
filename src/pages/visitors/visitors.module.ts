import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitorsPage } from './visitors';

@NgModule({
  declarations: [
    VisitorsPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitorsPage),
  ],
  exports: [
    VisitorsPage
  ]
})
export class VisitorsPageModule {}
