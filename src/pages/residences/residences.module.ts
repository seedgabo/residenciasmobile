import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Residences } from './residences';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [Residences],
  imports: [
    IonicPageModule.forChild(Residences),
    PipesModule
  ],
})
export class ResidencesModule { }
