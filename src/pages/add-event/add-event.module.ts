import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEventPage } from './add-event';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [AddEventPage],
  imports: [
    IonicPageModule.forChild(AddEventPage),
    PipesModule
  ],
})
export class AddEventPageModule { }
