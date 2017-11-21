import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-payment-report',
  templateUrl: 'payment-report.html',
})
export class PaymentReportPage {
  proccesingPayment: boolean;
  invoice;
  amount = 0;
  transaction = "deposit";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api, public loading: LoadingController) {
    this.invoice = navParams.get('invoice');
    this.amount = this.invoice.total;
    if (this.amount < 0) {
      this.amount = 0;
    }
    this.amount = Math.ceil(this.amount);
  }

  ionViewDidLoad() {
  }

  pay() {
    var loading = this.loading.create({ content: "..." });
    loading.present()
    this.api.post(`invoices/${this.invoice.id}/Payment`, { amount: this.amount, transaction: this.transaction })
      .then((data) => {
        loading.dismiss();
        this.dismiss();
      })
      .catch((err) => {
        this.api.Error(err);
        loading.dismiss();
      })
  }
  dismiss() {
    this.viewctrl.dismiss();
  }

}
