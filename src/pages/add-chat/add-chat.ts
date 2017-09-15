import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
@Component({
  selector: 'page-add-chat',
  templateUrl: 'add-chat.html',
})
export class AddChatPage {
  residences = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.navParams.get('residences');
  }

  ionViewDidLoad() {
  }

  close() {
    this.navCtrl.pop();
  }

}
