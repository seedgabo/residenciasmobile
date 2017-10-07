



import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {IonicPage} from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-tables',
  templateUrl: 'tables.html',
})
export class TablesPage {
  'VisitorsPage' = 'VisitorsPage';
  'VehiclesPage' = 'VehiclesPage';
  'WorkersPage' = 'WorkersPage';
  'PetsPage' = 'PetsPage';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TablesPage');
  }

}
