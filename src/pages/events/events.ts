import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Api } from "../../providers/api";
import { AddEventPage } from "../add-event/add-event";
import { EventPage } from "../event/event";
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public events: Events) {
  }

  ionViewDidLoad() {
    this.getEvents();
    this.events.subscribe("events:changed", () => {
      this._renderCalendar();
    })
  }

  getEvents(refresher = null) {
    this.api.get('events?take=200&afterEach[toCalendar]=null')
      .then((data: any) => {
        console.log(data);
        this.api._events = data;
        this._renderCalendar();
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

  _renderCalendar() {
    $("#calendar").fullCalendar({
      events: this.api._events,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,basicDay,agendaWeek'
      },
      locale: 'es',
      eventClick: (calEvent, jsEvent, view) => {
        this.event(calEvent);
      }
    });
  }

  event(ev) {
    console.log(ev);
    this.navCtrl.push(EventPage, { event: ev });
  }

  addEvent() {
    this.navCtrl.push(AddEventPage, {});
  }

}
