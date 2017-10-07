import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VehiclesEditorPage } from './vehicle-editor';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [VehiclesEditorPage],
  imports: [
    IonicPageModule.forChild(VehiclesEditorPage),
    PipesModule
  ],
})
export class VehiclesEditorPageModule { }
