import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitTabsPage } from './visit-tabs';
import { VisitorsPage } from '../visitors/visitors';

@NgModule({
  declarations: [
    VisitTabsPage,
    VisitorsPage,
  ],
  imports: [
    IonicPageModule.forChild(VisitTabsPage),
  ]
})
export class VisitTabsPageModule {}
