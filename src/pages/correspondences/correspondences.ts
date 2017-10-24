import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-correspondences',
  templateUrl: 'correspondences.html',
})
export class CorrespondencesPage {
  correspondences = [];
  loading = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public action: ActionSheetController, public api: Api) {
    this.correspondences = this.api.user.correspondences;
  }

  ionViewDidLoad() {
    this.getCorrespondences();
  }

  getCorrespondences(refresher = null) {
    this.api.get(`correspondences?where[residence_id]=${this.api.user.residence_id}&order[status]=asc&limit=100`)
      .then((data: any) => {
        this.correspondences = this.api.user.correspondences = data;
        if (refresher)
          refresher.complete()
        this.loading = false;
      })
      .catch(console.error)
  }

  actions(correspondence) {
    if (correspondence.status !== 'arrival') {
      return;
    }

    this.action.create({
      title: this.api.trans("literals.correspondence"),
      buttons: [
        {
          text: this.api.trans("__.marcar como recogido"),
          icon: "checkmark-circle",
          role: "accept",
          handler: () => {
            this.api.put(`correspondences/${correspondence.id}`, { status: 'delivered' })
              .then((data) => {
                correspondence.status = 'delivered'
              })
              .catch(console.error)
          }
        },
        {
          text: this.api.trans('crud.cancel'),
          icon: 'close',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    }).present();
  }
}
