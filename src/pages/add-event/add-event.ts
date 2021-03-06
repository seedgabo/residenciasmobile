import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
declare var moment: any;
import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddEventPage {
  newEvent: any = {
    title: "",
    start: moment.utc().startOf('day').add(1, 'day').local().format('YYYY-MM-DDTHH:mm:ss'),
    end: moment.utc().startOf('day').add(2, 'day').local().format('YYYY-MM-DDTHH:mm:ss'),
    privacity: 'public',
    type: "no specified",
    zones: [],
  };
  privacies = [
    'public',
    'private',
    'zone'
  ];
  visibilities = [
    'public',
    'private',
    'zone'
  ];
  types = [
    'party',
    'reunion',
    'meeting',
    'expose',
    'wedding',
    'birthday',
    'funeral',
  ];
  zones = [];
  loading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.api.get('zones').then((data: any) => {
      console.log(data);
      this.zones = data;

    }).catch((err) => {
      console.error(err);
    });
  }
  addEvent() {
    this.loading = true;
    this.newEvent.creator_id = this.api.user.id;
    this.api.post('events', this.newEvent)
      .then((data) => {
        console.log(data);
        this.loading = false;
        this.navCtrl.pop();
      })
      .catch((err) => {
        this.api.Error(err);
        this.loading = false;
        console.error(err);
      });
  }
  can() {
    return this.newEvent.title.length > 3;
  }

}
