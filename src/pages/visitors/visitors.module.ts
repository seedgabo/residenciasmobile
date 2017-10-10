import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitorsPage } from './visitors';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [VisitorsPage],
  imports: [
    IonicPageModule.forChild(VisitorsPage),
    PipesModule
  ],
})
export class VisitorsPageModule { }
