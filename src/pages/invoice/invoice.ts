import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import {IonicPage} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
})
export class InvoicePage {
  invoice;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.invoice = navParams.get('invoice');
  }

  ionViewDidLoad() {
  }

}
