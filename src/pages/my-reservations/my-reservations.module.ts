import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyReservationsPage } from './my-reservations';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [
    MyReservationsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyReservationsPage),
    PipesModule,
  ],
})
export class MyReservationsPageModule { }
