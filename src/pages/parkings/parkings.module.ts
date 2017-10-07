import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParkingsPage } from './parkings';
@NgModule({
  declarations: [ParkingsPage],
  imports: [
    IonicPageModule.forChild(ParkingsPage)
  ],
})
export class ParkingsPageModule { }
