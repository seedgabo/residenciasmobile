import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventPage } from './event';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [EventPage],
  imports: [
    IonicPageModule.forChild(EventPage),
    PipesModule
  ],
})
export class EventPageModule { }
