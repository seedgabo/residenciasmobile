import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CorrespondencesPage } from './correspondence';

@NgModule({
  declarations: [
    CorrespondencesPage,
  ],
  imports: [
    IonicPageModule.forChild(CorrespondencesPage),
    PipesModule
  ],
})
export class CorrespondencesPageModule { }
