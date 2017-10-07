import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentReportPage } from './payment-report';
@NgModule({
  declarations: [PaymentReportPage],
  imports: [
    IonicPageModule.forChild(PaymentReportPage)
  ],
})
export class PaymentReportPageModule { }
