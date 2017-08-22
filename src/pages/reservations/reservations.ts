import { ZoneReservationPage } from './../zone-reservation/zone-reservation';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import moment from 'moment'
@Component({
  selector: 'page-reservations',
  templateUrl: 'reservations.html',
})
export class ReservationsPage {
  @ViewChild('datetime') datetime: any
  zones = [];
  reservations = [];
  selected;
  date = moment().add(1, 'day').toDate() //.format('YYYY-MM-DD')
  today = moment()
  min = moment().toDate() //.format('YYYY-MM-DD')
  max = moment().add(1, 'year').toDate() //.format('YYYY-MM-DD')
  locale = { monday: true, weekdays: moment.weekdaysShort(), months: moment.months() }
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

  reservate(zone) {
    this.selected = zone
    this.datetime.open()
  }

  setDate(ev, zone) {
    var date = moment.utc(ev)
    this.navCtrl.push(ZoneReservationPage, { zone: zone, date: date }, { animation: 'ios-transition' })
  }

}
