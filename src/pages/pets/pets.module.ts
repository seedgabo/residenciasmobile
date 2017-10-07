import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetsPage } from './pets';
@NgModule({
  declarations: [PetsPage],
  imports: [
    IonicPageModule.forChild(PetsPage)
  ],
})
export class PetsPageModule { }
