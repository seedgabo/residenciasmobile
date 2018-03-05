import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';

declare var $: any;
moment.locale('es-us');
@IonicPage()
@Component({ selector: 'page-my-reservations', templateUrl: 'my-reservations.html' })
export class MyReservationsPage {
  view = 'list'
  reservations = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionsheet: ActionSheetController, public api: Api) {
    this.reservations = navParams.get('reservations');
  }

  ionViewDidLoad() {
    this.getMyReservations();
  }

  getMyReservations() {
    this.api.get('reservations?where[user_id]=' + this.api.user.id + "&order[start]=desc&with[]=zone&with[]=zone.image&with[]=event&whereDategte[start" +
      "]=" + moment.utc().subtract(1, 'day').local().format("YYYY-MM-DD"))
      .then((data: any) => {
        console.log(data);
        this.reservations = data;
        this.prepareReservations();
      })
      .catch(console.error)
  }

  prepareReservations() {
    this.reservations.forEach((reserv) => {
      reserv.title = `${reserv.zone.name}  ${reserv.event
        ? '-' + reserv.event.name
        : ''} : ${reserv
          .quotas} ${this
            .api
            .trans('literals.persons')}`
    })
  }

  changeView() {
    if (this.view == 'list') {
      this.view = 'calendar'
      setTimeout(() => {
        this.renderCalendar();
      }, 100)
    } else {
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
        this.actions(calEvent);
      }
    });
  }

  actions(reserv) {
    var text = "";
    if(!this.canCancel(reserv)){
      text = this.api.trans('__.ya no es posible cancelar') + " (" + (this.api.settings.hours_to_cancel_reservation ? this.api.settings.hours_to_cancel_reservation : 24 ) +"hrs)"
    } 
    var sheet = this.actionsheet.create({
      title: this.api.trans('literals.actions') + " " + this.api.trans('literals.reservation'),
      subTitle: text
    })

    if (this.canCancel(reserv)) {
      sheet.addButton({
        text: this.api.trans("crud.cancel") + " " + this.api.trans('literals.reservation'),
        icon: 'remove-circle',
        role: 'destructive',
        cssClass: "icon-danger",
        handler: () => {
          this.cancelReservation(reserv);
        }
      })
    }

    sheet.addButton({
      text: this
        .api
        .trans('crud.cancel'),
      icon: 'close',
      role: 'cancel',
      handler: () => { }
    })

    sheet.present()
  }

  canCancel(reserv) {
    var hours = this.api.settings.hours_to_cancel_reservation
    if (!hours)
      hours = 24;
    if (reserv.status == 'cancelled')
      return false;
    return moment(reserv.start).diff(moment(), "hours") >= hours
  }

  cancelReservation(reservation) {
    return new Promise((resolve, reject) => {
      this
        .api
        .alert
        .create({
          title: this
            .api
            .trans('__.Nota de cancelación'),
          inputs: [
            {
              label: this
                .api
                .trans('literals.notes'),
              name: 'note',
              placeholder: this
                .api
                .trans('literals.notes')
            }
          ],
          buttons: [
            {
              text: this
                .api
                .trans('literals.send'),
              handler: (data) => {
                var promise = this
                  .api
                  .put(`reservations/${reservation.id}`, {
                    status: 'cancelled',
                    'note': data.note
                  })
                promise.then((resp) => {
                  reservation.status = 'cancelled';
                  reservation.note = data.note;
                  this.sendPush(this.api.trans('literals.reservation') + " " + this.api.trans('literals.cancelled') + ": " + data.note, reservation)
                  resolve(resp);
                }).catch((e) => {
                  reject(e)
                  this
                    .api
                    .Error(e);
                })
              }
            }, {
              text: this
                .api
                .trans('crud.cancel'),
              handler: () => {
                reject()
              }
            }
          ]
        })
        .present();

    })
  }

  sendPush(message, reservation) {
    var user_id = reservation.user_id
    this
      .api
      .post('push/' + user_id + '/notification', { message: message })
      .then(() => { })
      .catch((error) => {
        console.error(error);
      })
  }

}
