import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Api } from "../../providers/api";


import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-residences',
  templateUrl: 'residences.html',
})
export class Residences {
  residences: any = [];
  loading = true;


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public api: Api) {

  }

  ionViewDidLoad() {
    this.getResidences();
  }
  getResidences() {

    this.api.get("residences?with[]=owner")
      .then((data: any) => {
        console.log(data);
        this.loading = false
        this.residences = data;
      })
      .catch((err) => {
        console.error(err);
        this.api.Error(err);

      })
  }
}




