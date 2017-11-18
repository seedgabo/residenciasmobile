import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';

import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-new-visit',
  templateUrl: 'new-visit.html',
})
export class NewVisitPage {
  dismissforUpdate: (data: any) => void;
  visit: any = {};
  api: any;
  already_dismiss = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public events: Events) {
    this.visit = navParams.get('visit');
    this.api = navParams.get('api');
    console.log(this.visit);
    if (!this.visit || (!this.visit.guest && !this.visit.visitor)) {
      this.api.get(`visits?where[residence_id]=${this.api.user.residence_id}&limit=1&order[created_at]=desc&append[]=guest`)
        .then((data) => {
          this.visit = data[0];
          this.getVisit();
        })
    }
    else {
      this.getVisit();
    }
    this.dismissforUpdate = (data) => {
      if (data.visit.id == this.visit.id) {
        this.dismiss();
      }
    };
  }


  getVisit() {
    this.api.get(`visits/${this.visit.id}?with[]=visitor&with[]=vehicle&with[]=visitors&with[]=user&with[]=creator&&append[]=guest`)
      .then((data) => {
        this.visit = data;
        console.log(this.visit);
      })
      .catch(console.error)
  }

  ionViewDidLoad() {
    this.events.subscribe('VisitUpdated', this.dismissforUpdate);
  }

  dismiss() {
    this.events.unsubscribe('VisitUpdated', this.dismissforUpdate);
    if (!this.already_dismiss) {
      this.viewctrl.dismiss();
      this.already_dismiss = true;
      this.events.publish('stopSound', {});
    }
  }

  confirm() {
    this.api.post(`visits/${this.visit.id}/visitApprove`, { status: 'approved' })
      .then(
      (data) => {
        console.log(data);
        this.dismiss();
      }
      )
      .catch(
      (err) => {
        console.error(err);
      });
  }

  reject() {
    if (!this.visit || !this.visit.id)
      this.dismiss();
    this.api.post(`visits/${this.visit.id}/visitApprove`, { status: 'rejected' })
      .then(
      (data) => {
        console.log(data);
        this.dismiss();
      }
      )
      .catch(
      (err) => {
        console.error(err);
      });
  }

}
