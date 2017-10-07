import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetsEditorPage } from './pet-editor';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [PetsEditorPage],
  imports: [
    IonicPageModule.forChild(PetsEditorPage),
    PipesModule
  ],
})
export class PetsEditorPageModule { }
