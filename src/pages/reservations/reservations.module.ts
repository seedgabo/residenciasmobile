import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReservationsPage } from './reservations';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [ReservationsPage],
  imports: [
    IonicPageModule.forChild(ReservationsPage),
    PipesModule
  ],
})
export class ReservationsPageModule { }
