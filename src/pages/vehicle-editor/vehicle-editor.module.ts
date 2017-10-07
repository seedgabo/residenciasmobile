import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehiclesEditorPage } from './vehicle-editor';
@NgModule({
  declarations: [VehiclesEditorPage],
  imports: [
    IonicPageModule.forChild(VehiclesEditorPage)
  ],
})
export class VehiclesEditorPageModule { }
