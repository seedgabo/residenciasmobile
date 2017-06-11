import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
// @IonicPage()
@Component({
  selector: 'page-visits',
  templateUrl: 'visits.html',
})
export class VisitsPage {
  enable_loader: boolean = true;
  visits = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitsPage');
    this.visits = this.api.visits;
  }


  loadMoreVisits(infiniteScroll = null) {
    this.api.get(`visits?where[residence_id]=${this.api.residence.id}&whereGt[id]=${this.visits[0].id}`)
      .then((data: any) => {
        infiniteScroll.complete()
        if (data.length == 0) {
          this.enable_loader = false;
        }
        this.visits = this.visits.concat(data);
        if (infiniteScroll)
          infiniteScroll.complete()
      })
      .catch((err) => {
        console.error(err);
        if (infiniteScroll)
          infiniteScroll.complete()
      });
  }

}
