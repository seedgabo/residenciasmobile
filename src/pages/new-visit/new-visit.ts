import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-new-visit',
  templateUrl: 'new-visit.html',
})
export class NewVisitPage {
  visitor: any = {};
  visit: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController) {
    this.visit = navParams.get('visit');
    this.visitor = navParams.get('visitor');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewVisitPage');
  }

  confirm() {
    this.viewctrl.dismiss();
  }

  reject() {
    this.viewctrl.dismiss();
  }

}
