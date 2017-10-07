import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetsPage } from './pets';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [PetsPage],
  imports: [
    IonicPageModule.forChild(PetsPage),
    PipesModule
  ],
})
export class PetsPageModule { }
