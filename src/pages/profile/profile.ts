import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile = {};
  residence = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.profile = JSON.parse(JSON.stringify(this.api.user));
    this.residence = JSON.parse(JSON.stringify(this.api.residence));
  }

  ionViewDidLoad() {

  }

  save() {

  }
  canSaveUser() {

  }
  canSaveResidence() {

  }

}
