import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { Api } from "../../providers/api";
import { NewVisitorPage } from "../new-visitor/new-visitor";
import { NewVisitPage } from "../new-visit/new-visit";
@IonicPage()
@Component({
  selector: 'page-visitors',
  templateUrl: 'visitors.html',
})
export class VisitorsPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public modal: ModalController, public actionsheet: ActionSheetController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitorsPage');
  }
  addVisitor() {
    this.modal.create(NewVisitorPage, {}, { showBackdrop: true, enableBackdropDismiss: true }).present();
  }
  updateVisitor(visitor) {
    this.modal.create(NewVisitorPage, { visitor: visitor }, { showBackdrop: true, enableBackdropDismiss: true }).present();
  }

  addVisit(visitor) {
    this.modal.create(NewVisitPage, { visitor: visitor }, { showBackdrop: true, enableBackdropDismiss: true }).present();
  }
  delete(visitor) {
    this.api.delete('visitors/' + visitor.id).catch((err) => {
      console.error(err);
    });
  }
  actions(visitor) {
    this.actionsheet.create({
      title: this.api.trans('literals.actions') + " | " + visitor.name,
      buttons: [
        {
          text: this.api.trans('literals.generate') + " " + this.api.trans('literals.visit'),
          icon: 'person-add',
          cssClass: 'icon-primary',
          handler: () => { this.addVisit(visitor) }
        },
        {
          text: this.api.trans('crud.edit'),
          icon: 'create',
          cssClass: 'icon-secondary',
          handler: () => { this.updateVisitor(visitor) }
        },
        {
          text: this.api.trans('crud.delete'),
          icon: 'trash',
          role: 'destructive',
          cssClass: 'icon-danger',
          handler: () => { this.delete(visitor) }
        }

      ]
    }).present();
  }

}
