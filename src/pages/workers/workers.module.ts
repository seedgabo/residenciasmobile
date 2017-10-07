import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkersPage } from './workers';
@NgModule({
  declarations: [WorkersPage],
  imports: [
    IonicPageModule.forChild(WorkersPage)
  ],
})
export class WorkersPageModule { }
