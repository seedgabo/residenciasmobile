import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkersPage } from './workers';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [WorkersPage],
  imports: [
    IonicPageModule.forChild(WorkersPage),
    PipesModule
  ],
})
export class WorkersPageModule { }
