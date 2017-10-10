import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisitsPage } from './visits';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [VisitsPage],
  imports: [
    IonicPageModule.forChild(VisitsPage),
    PipesModule
  ],
})
export class VisitsPageModule { }
