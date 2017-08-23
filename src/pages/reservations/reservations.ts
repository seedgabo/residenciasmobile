import { ZoneReservationPage } from './../zone-reservation/zone-reservation';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { DatePickerDirective } from 'datepicker-ionic2';
import moment from 'moment'

@Component({
  selector: 'page-reservations',
  templateUrl: 'reservations.html',
})
export class ReservationsPage {
  @ViewChild(DatePickerDirective) datepickerDirective: DatePickerDirective;
  zones = [];
  reservations = [];
  selected;
  date = moment.utc().add(1, 'day').toDate() //.format('YYYY-MM-DD')
  today = moment.utc()
  min = moment.utc().startOf('day').toDate() //.format('YYYY-MM-DD')
  max = moment.utc().startOf('day').add(1, 'year').toDate() //.format('YYYY-MM-DD')
  locale = { monday: true, weekdays: moment.weekdaysShort(), months: moment.months() }
  disabledDates = []
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
    this.disabledDates = this.getDisabledDays(this.selected.days);
    setTimeout(() => {
      this.datepickerDirective.open()
    }, 200)
  }

  setDate(ev, zone) {
    var date = moment.utc(ev)
    this.navCtrl.push(ZoneReservationPage, { zone: zone, date: date }, { animation: 'ios-transition' })
  }



  getDisabledDays(availables_days) {
    var notDays = this.arr_diff(availables_days, ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
    var disabledDates = []
    notDays.forEach((day) => {
      disabledDates = this.disabledDates.concat(
        this.getDaysBetweenDates(
          this.min, this.max, day
        )
      )
    })
    return disabledDates;
  }

  getDaysBetweenDates(start, end, dayName) {
    var result = [];
    var days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    var day = days[dayName.toLowerCase().substr(0, 3)];
    // Copy start date
    var current = new Date(start);
    // Shift to next of required days
    current.setDate(current.getUTCDate() + (day - current.getUTCDate() + 7) % 7);
    // While less than end date, add dates to result array
    while (current < new Date(end)) {
      result.push(new Date(+current));
      current.setDate(current.getDate() + 7);
    }
    return result;
  }

  arr_diff(a1, a2) {
    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
      a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      } else {
        a[a2[i]] = true;
      }
    }

    for (var k in a) {
      diff.push(k);
    }

    return diff;
  }
}
