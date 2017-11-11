import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import moment from 'moment';
import { IonicPage, ToastController } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-zone-reservation',
  templateUrl: 'zone-reservation.html',
})
export class ZoneReservationPage {
  zone;
  date;
  options = []
  collection = {}
  reservations = [];
  schedule = [];
  loading = true
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public toast: ToastController) {
    this.zone = navParams.get('zone')
    this.date = navParams.get('date')
    this.schedule = this.zone.schedule;
    console.log(this.schedule, this.zone, this.date);
  }

  ionViewDidLoad() {
    this.loading = true
    console.log(this.zone);
    this.buildList();
    this.getReservations()
  }

  buildList() {
    this.options = [];
    var intervals = this.schedule["" + this.date.locale('en').format('dddd').toLowerCase()];
    if (!intervals || intervals[0] == null) {
      this.navCtrl.pop();
      this.toast.create({
        message: this.api.trans("__.no disponible"),
        duration: 3500
      }).present();
      return
    }
    intervals.forEach(element => {
      var start = this.date.clone().startOf('day').add(element[0].split(':')[0], 'hours').add(element[0].split(':')[1], 'minutes')

      var end = this.date.clone().startOf('day').add(element[1].split(':')[0], 'hours').add(element[1].split(':')[1], 'minutes')

      var ref = {
        available: this.zone.limit_user == 0 ? Number.MAX_SAFE_INTEGER : this.zone.limit_user,
        limit_user: this.zone.limit_user,
        start: start,
        end: end,
        ref: start.format("HH:mm")
      }
      this.options[this.options.length] = ref
      this.collection["" + start.clone().format("HH:mm")] = ref
    });
  }

  getReservations() {
    this.api.get(`reservations?where[zone_id]=${this.zone.id}&whereDateBetween[start]=${this.date.format("YYYY-MM-DD")},${this.date.clone().add(1, 'd').format("YYYY-MM-DD")}`)
      .then((data: any) => {
        this.reservations = data;
        console.log(data);
        data.forEach(reservation => {
          var ref = moment.utc(reservation.start).format("HH:mm")
          console.log(this.collection[ref])
          this.collection[ref].available -= reservation.quotas;
          if (reservation.user_id === this.api.user.id) {
            this.collection[ref].reserved = true
            this.collection[ref].reservation = reservation
          }
        });
        this.loading = false
      })
      .catch(console.error)
  }

  reservate(interval) {
    if (interval.reserved) {
      return this.viewReservation(interval)
    }
    if (!this.canReservate(interval)) {
      return this.alert.create({
        title: this.api.trans('literals.reservation') + " " + this.api.trans('literals.cancelled'),
        message: this.api.trans('__.No puedes reservar en este intervalo por que tu o alguien de tu :residence ya reservo en un horario cercano', { residence: this.api.trans('literals.residence') }),
        buttons: ["OK"]
      }).present();
    }
    var alert = this.alert.create({
      title: this.api.trans('literals.reservation') + " " + this.zone.name,
      message: this.api.trans("__.elija la cantidad de personas"),
      inputs: [
        {
          max: parseInt(interval.available),
          min: 1,
          value: "1",
          type: "number",
          label: this.api.trans("literals.quotas"),
          placeholder: this.api.trans("literals.quotas"),
          name: "quotas"
        }
      ],
      buttons: [
        {
          text: this.api.trans('crud.cancel'),
          role: "cancel"
        },
        {
          cssClass: "secondary",
          text: this.api.trans('literals.reservate'),
          handler: (data) => {
            if (data.quotas > 0)
              this.postReservation(interval, data.quotas)
          }
        },
      ]
    })
    alert.present()
  }

  canReservate(interval) {
    var reservable = true;
    this.reservations.forEach((reserv) => {
      if (reserv.user_id == this.api.user.id || reserv.residence_id == this.api.user.residence_id) {
        if (moment.utc(reserv.start).format('HH:mm') == moment.utc(interval.start).format('HH:mm')
          || moment.utc(reserv.start).format('HH:mm') == moment.utc(interval.end).format('HH:mm')
          || moment.utc(reserv.end).format('HH:mm') == moment.utc(interval.start).format('HH:mm')
          || moment.utc(reserv.end).format('HH:mm') == moment.utc(interval.end).format('HH:mm')) {
          reservable = false;
        }
      }
    })
    return reservable;
  }

  viewReservation(interval) {
    var alert = this.alert.create({
      title: this.api.trans('literals.reservation') + " " + this.zone.name,
      subTitle: this.api.trans('literals.quotas') + ": " + interval.reservation.quotas,
      message: this.api.trans('literals.user') + ": " + this.api.user.name,
      buttons: [
        {
          text: "OK"
        },
        {
          text: this.api.trans("crud.cancel") + " " + this.api.trans("literals.reservation"),
          role: "destructive",
          handler: () => {
            this.alert.create({ message: "no disponible aun" }).present()
          }

        }
      ]
    })
    alert.present();
  }

  postReservation(interval, quotas) {
    this.api.post('reservations',
      {
        quotas: quotas,
        zone_id: this.zone.id,
        user_id: this.api.user.id,
        start: interval.start.format("YYYY-MM-DD HH:mm"),
        end: interval.end.format("YYYY-MM-DD HH:mm"),
      })
      .then((data) => {
        console.log(data);
        this.ionViewDidLoad();
      })
      .catch(console.error)
  }

}
