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
    this.visit = navParams.data.visit;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitPage');
    this.api.get(`visits/${this.visit.id}?with[]=visitor&with[]=visitors&with[]=parking&with[]=vehicle`)
      .then(data => { this.visit = data })
      .catch(console.error)
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
