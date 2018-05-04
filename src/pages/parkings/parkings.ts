import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";

import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-parkings",
  templateUrl: "parkings.html"
})
export class ParkingsPage {
  selectedItem: any;
  query = "";
  parkings = [];
  loading = true
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api
  ) {}

  ionViewDidLoad() {
    this.api
      .load("parkings")
      .then((parkings: any) => {
        this.parkings = parkings;
        this.loading = false
      })
      .catch(err => {
        this.api.Error(err)
        this.loading = false
        console.error(err);
      });
  }

  filter() {
    if (this.query == "") return (this.parkings = this.api.objects.parkings);
    this.parkings = this.api.objects.parkings.filter(park => {
      if (park.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1)
        return true;
      if (
        park.user &&
        park.user.full_name.toLowerCase().indexOf(this.query.toLowerCase()) > -1
      )
        return true;

      return false;
    });
  }

  park(parking) {
    var status = parking.status == "available" ? "occuped" : "available";
    this.api
      .put("parkings/" + parking.id, { status: status })
      .then(response => {
        console.log(response);
        parking.status = status;
      });
  }
}
