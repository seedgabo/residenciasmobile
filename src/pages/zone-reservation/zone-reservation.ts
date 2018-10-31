import { Api } from "./../../providers/api";
import { Component } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import moment from "moment";
import { IonicPage, ToastController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-zone-reservation",
  templateUrl: "zone-reservation.html"
})
export class ZoneReservationPage {
  zone;
  date;
  options = [];
  collection = {};
  reservations = [];
  schedule = [];
  loading = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public alert: AlertController,
    public toast: ToastController
  ) {
    this.zone = navParams.get("zone");
    this.date = navParams.get("date");
    this.schedule = this.zone.schedule;
    console.log(this.schedule, this.zone, this.date);
  }

  ionViewDidLoad() {
    this.loading = true;
    console.log(this.zone);
    this.buildList();
    this.getReservations();
    console.log({ component: this });
  }

  buildList() {
    this.options = [];
    var intervals = this.schedule[
      "" +
        this.date
          .locale("en")
          .format("dddd")
          .toLowerCase()
    ];
    if (!intervals || intervals[0] == null) {
      this.navCtrl.pop();
      this.toast
        .create({
          message: this.api.trans("__.no disponible"),
          duration: 3500
        })
        .present();
      return;
    }
    intervals.forEach((element) => {
      var start = this.date
        .clone()
        .startOf("day")
        .add(element[0].split(":")[0], "hours")
        .add(element[0].split(":")[1], "minutes");

      var end = this.date
        .clone()
        .startOf("day")
        .add(element[1].split(":")[0], "hours")
        .add(element[1].split(":")[1], "minutes");
      console.log(start.format(), end.format());
      if (start > moment() && end > moment()) {
        var ref = {
          available: this.zone.limit_user == 0 || this.zone.limit_user == null ? Number.MAX_SAFE_INTEGER : this.zone.limit_user,
          limit_user: this.zone.limit_user,
          start: start,
          end: end,
          ref: start
            .clone()
            // .local()
            .format("HH:mm")
        };
        this.options[this.options.length] = ref;
        this.collection[
          "" +
            start
              .clone()
              // .local()
              .format("HH:mm")
        ] = ref;
      }
    });
  }

  getReservations() {
    this.api
      .get(
        `reservations?where[zone_id]=${this.zone.id}&whereNotIn[status]=cancelled,rejected&whereDateBetween[start]=${this.date.format(
          "YYYY-MM-DD"
        )},${this.date
          .clone()
          .add(1, "d")
          .format("YYYY-MM-DD")}`
      )
      .then((data: any) => {
        this.reservations = data;
        data.forEach((reservation) => {
          var ref = moment(reservation.start).format("HH:mm");
          if (this.collection[ref]) {
            this.collection[ref].available -= reservation.quotas;
            if (reservation.user_id === this.api.user.id) {
              this.collection[ref].reserved = true;
              this.collection[ref].reservation = reservation;
            }
          }
        });
        this.loading = false;
      })
      .catch(console.error);
  }

  reservate(interval) {
    if (interval.reserved) {
      return this.viewReservation(interval);
    }
    if (interval.available <= 0 || !this.canReservate(interval)) {
      return this.alert
        .create({
          title: this.api.trans("literals.reservation") + " " + this.api.trans("literals.cancelled"),
          message: this.api.trans("__.No puedes reservar en este intervalo"),
          buttons: ["OK"]
        })
        .present();
    }
    var alert = this.alert.create({
      title: this.api.trans("literals.reservation") + " " + this.zone.name,
      inputs: [
        {
          max: parseInt(interval.available),
          min: 1,
          value: "1",
          type: "number",
          label: this.api.trans("__.elija la cantidad de personas"),
          placeholder: this.api.trans("__.elija la cantidad de personas"),
          name: "quotas"
        },
        {
          value: "",
          type: "text",
          label: this.api.trans("literals.notes"),
          placeholder: this.api.trans("literals.notes"),
          name: "note"
        }
      ],
      buttons: [
        {
          text: this.api.trans("crud.cancel"),
          role: "cancel"
        },
        {
          cssClass: "secondary",
          text: this.api.trans("literals.reservate"),
          handler: (data) => {
            if (data.quotas > 0 && data.quotas <= parseInt(interval.available)) {
              this.postReservation(interval, data);
            } else {
              this.alert
                .create({
                  title: this.api.trans("__.Cantidad Invalida"),
                  buttons: ["Ok"]
                })
                .present();
            }
          }
        }
      ]
    });
    alert.present();
  }

  canReservate(interval) {
    var reservable = true;
    this.reservations.forEach((reserv) => {
      if (reserv.user_id == this.api.user.id || reserv.residence_id == this.api.user.residence_id) {
        if (
          moment
            .utc(reserv.start)
            // .local()
            .format("HH:mm") ==
            moment
              .utc(interval.start)
              // .local()
              .format("HH:mm") ||
          moment
            .utc(reserv.start)
            // .local()
            .format("HH:mm") ==
            moment
              .utc(interval.end)
              // .local()
              .format("HH:mm") ||
          moment
            .utc(reserv.end)
            // .local()
            .format("HH:mm") ==
            moment
              .utc(interval.start)
              // .local()
              .format("HH:mm") ||
          moment
            .utc(reserv.end)
            // .local()
            .format("HH:mm") ==
            moment
              .utc(interval.end)
              // .local()
              .format("HH:mm")
        ) {
          reservable = false;
        }
      }
    });
    return reservable;
  }

  viewReservation(interval) {
    var buttons: any = [
      {
        text: "OK"
      }
    ];
    if (this.canCancel(interval.reservation)) {
      buttons.push({
        text: this.api.trans("crud.cancel") + " " + this.api.trans("literals.reservation"),
        role: "destructive",
        handler: () => {
          console.log(interval.reservation);
          this.cancelReservation(interval.reservation).then(() => {
            this.ionViewDidLoad();
          });
        }
      });
    }
    var alert = this.alert.create({
      title: this.api.trans("literals.reservation") + " " + this.zone.name,
      subTitle: this.api.trans("literals.quotas") + ": " + interval.reservation.quotas,
      message: this.api.trans("literals.user") + ": " + this.api.user.name,
      buttons: buttons
    });
    alert.present();
  }

  canCancel(reserv) {
    var hours = this.api.settings.hours_to_cancel_reservation;
    if (!hours) hours = 24;
    if (reserv.status == "cancelled") return false;
    return moment(reserv.start).diff(moment(), "hours") >= hours;
  }

  cancelReservation(reservation) {
    return new Promise((resolve, reject) => {
      this.api.alert
        .create({
          title: this.api.trans("__.Nota de cancelación"),
          inputs: [
            {
              label: this.api.trans("literals.notes"),
              name: "note",
              placeholder: this.api.trans("literals.notes")
            }
          ],
          buttons: [
            {
              text: this.api.trans("literals.send"),
              handler: (data) => {
                var promise = this.api.put(`reservations/${reservation.id}`, {
                  status: "cancelled",
                  note: data.note
                });
                promise
                  .then((resp) => {
                    reservation.status = "cancelled";
                    reservation.note = data.note;
                    this.sendPush(
                      this.api.trans("literals.reservation") + " " + this.api.trans("literals.cancelled") + ": " + data.note,
                      reservation
                    );
                    resolve(resp);
                  })
                  .catch((e) => {
                    reject(e);
                    this.api.Error(e);
                  });
              }
            },
            {
              text: this.api.trans("crud.cancel"),
              handler: () => {
                reject();
              }
            }
          ]
        })
        .present();
    });
  }

  postReservation(interval, data) {
    var { quotas, note } = data;
    this.api
      .post("reservations", {
        quotas: quotas,
        zone_id: this.zone.id,
        user_id: this.api.user.id,
        note: note,
        start: interval.start
          .clone()
          // .local()
          .format("YYYY-MM-DD HH:mm"),
        end: interval.end
          .clone()
          // .local()
          .format("YYYY-MM-DD HH:mm")
      })
      .then((data) => {
        console.log(data);
        this.ionViewDidLoad();
      })
      .catch(console.error);
  }

  sendPush(message, reservation) {
    var user_id = reservation.user_id;
    this.api
      .post("push/" + user_id + "/notification", { message: message })
      .then(() => {})
      .catch((error) => {
        console.error(error);
      });
  }
}
