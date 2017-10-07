import { NgModule } from '@angular/core';
import { IonicPageModule, ModalCmp } from 'ionic-angular';
import { ReservationsPage } from './reservations';
import { PipesModule } from '../../pipes/pipes.module';
import { DatePickerModule } from 'datepicker-ionic2';

@NgModule({
  declarations: [ReservationsPage],
  entryComponents: [ModalCmp],
  imports: [
    IonicPageModule.forChild(ReservationsPage),
    PipesModule,
    DatePickerModule,
  ],
})
export class ReservationsPageModule { }
