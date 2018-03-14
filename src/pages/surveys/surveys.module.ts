import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveysPage } from './surveys';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [SurveysPage],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(SurveysPage),
    PipesModule
  ],
})
export class SurveysPageModule { }
