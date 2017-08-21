import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";

@Component({
  selector: 'page-reservations',
  templateUrl: 'reservations.html',
})
export class ReservationsPage {
  zones = [];
  reservations = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {

  }

  ionViewDidLoad() {
    this.getReservations();
    this.getZones();
  }

  getReservations() {
    this.api.get('reservations?where[user_id]=' + this.api.user.id)
      .then((data: any) => { this.reservations = data })
      .catch(console.error)
  }

  getZones() {
    this.api.get('zones?scope[reservable]=')
      .then((data: any) => { this.zones = data; console.log("zones:", data) })
      .catch(console.error)
  }

  humanize(interval) {
    return interval + " " + "minutos";
  }

}
