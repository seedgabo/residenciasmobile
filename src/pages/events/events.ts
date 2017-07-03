import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { AddEventPage } from "../add-event/add-event";
declare var $: any;
declare var moment: any;
moment.locale('es');
// @IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {
  calendarOptions
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.getEvents();
  }

  getEvents(refresher = null) {
    this.api.get('events?take=200&afterEach[toCalendar]=null').then((data) => {
      console.log(data);
      $("#calendar").fullCalendar({
        locale: 'es',
        events: data,
        eventClick: (calEvent, jsEvent, view) => {
          this.event(calEvent);
        }
      });
      if (refresher != null) {
        refresher.complete();
      }
    })
      .catch((err) => {
        if (refresher != null) {
          refresher.complete();
        }
        console.error(err);
      });
  }

  event(event) {
    console.log(event);
  }

  addEvent() {
    this.navCtrl.push(AddEventPage, {});
  }

}
