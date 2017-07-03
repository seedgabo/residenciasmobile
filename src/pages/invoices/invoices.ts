import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";

@Component({
  selector: 'page-invoices',
  templateUrl: 'invoices.html',
})
export class InvoicesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.getInvoices();
  }

  getInvoices(refresher = null) {
    this.api.get(`invoices?order[date]=desc&where[residence_id]=${this.api.user.residence_id}&with[]=user&take=12`)
      .then((data: any) => {
        console.log(data);
        this.api.invoices = data;
        if (refresher != null)
          refresher.complete();
      })
      .catch((err) => {
        console.error(err);
        if (refresher != null)
          refresher.complete();

      });
  }

}
