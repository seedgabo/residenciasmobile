import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyPage } from './survey';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [SurveyPage],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(SurveyPage),
    PipesModule
  ],
})
export class SurveyPageModule { }
