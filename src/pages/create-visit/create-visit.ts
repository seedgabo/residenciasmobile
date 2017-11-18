import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { Api } from "../../providers/api";
@IonicPage()
@Component({
  selector: 'page-create-visit',
  templateUrl: 'create-visit.html',
})
export class CreateVisitPage {

  visitor: any;
  visitors = [];
  visit: any = {
    status: 'approved',
  }
  loading = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public viewCtrl: ViewController) {
    var visitor = navParams.get('visitor');
    var guest = navParams.get('guest');
    if (Array.isArray(visitor)) {
      this.visitors = visitor;
      this.visit.visitors = [];
      this.visitors.forEach((visitor) => {
        this.visit.visitors.push(visitor.id);
      })
    } else {
      this.visitor = navParams.get('visitor');
      this.visit.visitor_id = this.visitor.id;
    }
    this.visit.residence_id = this.api.residence.id;
    this.visit.user_id = this.api.user.id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateVisitPage');
  }

  create() {
    this.loading = true;
    this.api.post('visits', this.visit)
      .then(
      (data) => {
        console.log(data);
        this.loading = false
        this.dismiss();
      })
      .catch(
      (err) => {
        this.loading = false
        this.api.Error(err)
        console.error(err);
      })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
