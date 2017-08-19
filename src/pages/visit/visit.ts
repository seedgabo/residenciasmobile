import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
@Component({
  selector: 'page-visit',
  templateUrl: 'visit.html',
})
export class VisitPage {
  visit: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.visit = navParams.get('visit');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitPage');
  }

  updateVisit() {
    console.log(this.visit)
    this.api.put('visits/' + this.visit.id, { status: this.visit.status })
      .then((data) => {
        console.log(data)
      })
      .catch(console.error)
  }
  dismiss() {
    this.navCtrl.pop();
  }
}
