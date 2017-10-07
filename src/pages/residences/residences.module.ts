import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Residences } from './residences';
@NgModule({
  declarations: [Residences],
  imports: [
    IonicPageModule.forChild(Residences)
  ],
})
export class ResidencesModule { }
