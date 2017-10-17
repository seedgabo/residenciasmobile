import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';

declare var $: any;
moment.locale('es');
@IonicPage()
@Component({
  selector: 'page-my-reservations',
  templateUrl: 'my-reservations.html',
})
export class MyReservationsPage {
  view = 'list'
  reservations = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.reservations = navParams.get('reservations');
  }

  ionViewDidLoad() {
    this.getMyReservations();
  }

  getMyReservations() {
    this.api.get('reservations?where[user_id]=' + this.api.user.id + "&order[start]=desc&with[]=zone&with[]=zone.image&with[]=event&whereDategte[start]=" + moment.utc().subtract(1, 'day').format("YYYY-MM-DD"))
      .then((data: any) => {
        console.log(data);
        this.reservations = data;
        this.prepareReservations();
      })
      .catch(console.error)
  }

  prepareReservations() {
    this.reservations.forEach((reserv) => {
      reserv.title = `<b>${reserv.zone.name}</b>: ${reserv.start.format('LLLL')} - ${reserv.end.format('LLLL')}`
    })
  }

  changeView() {
    if (this.view == 'list') {
      this.view = 'calendar'
      setTimeout(() => {
        this.renderCalendar();
      }, 100)
    }
    else {
      this.view = 'list'
    }

  }

  renderCalendar() {
    $("#calendar-reservations").fullCalendar({
      events: this.reservations,
      height: "parent",
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,basicDay'
      },
      locale: 'es',
      eventClick: (calEvent, jsEvent, view) => {
        console.log(calEvent);
      }
    });
  }


}
