import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentReportPage } from './payment-report';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [PaymentReportPage],
  imports: [
    IonicPageModule.forChild(PaymentReportPage),
    PipesModule
  ],
})
export class PaymentReportPageModule { }
