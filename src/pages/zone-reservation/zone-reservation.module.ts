import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ZoneReservationPage } from './zone-reservation';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [ZoneReservationPage],
  imports: [
    IonicPageModule.forChild(ZoneReservationPage),
    PipesModule
  ],
})
export class ZoneReservationPageModule { }
