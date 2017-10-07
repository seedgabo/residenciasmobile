import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetsEditorPage } from './pet-editor';
@NgModule({
  declarations: [PetsEditorPage],
  imports: [
    IonicPageModule.forChild(PetsEditorPage)
  ],
})
export class PetsEditorPageModule { }
