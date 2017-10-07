import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveysPage } from './surveys';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [SurveysPage],
  imports: [
    IonicPageModule.forChild(SurveysPage),
    PipesModule
  ],
})
export class SurveysPageModule { }
