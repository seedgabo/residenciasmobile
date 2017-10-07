import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitTabsPage } from './visit-tabs';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [VisitTabsPage],
  imports: [
    IonicPageModule.forChild(VisitTabsPage),
    PipesModule
  ],
})
export class VisitTabsPageModule { }
