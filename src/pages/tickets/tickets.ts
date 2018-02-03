import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Api } from '../../providers/api';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html',
})
export class TicketsPage {
  _tickets: any = { data: [] };
  tickets = [];
  query = "";
  loading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public actionsheet: ActionSheetController, public modal: ModalController) {
  }

  ionViewDidEnter() {
    this.api.ready.then(() => {
      this.getTickets();
    });
  }

  getTickets(refresher = null) {
    this.loading = true;
    this.api.get(`tickets?where[user_id]=${this.api.user.id}&withCount[]=comments&order[updated_at]=desc&paginate=100`)
      .then((data: any) => {
        this._tickets = data;
        this.filter();
        this.loading = false;
        if (refresher) refresher.complete()
      })
      .catch((err) => {
        this.api.Error(err);
        this.loading = false;
        if (refresher) refresher.complete()
      })
  }

  filter() {
    if (this.query == "") {
      this.tickets = this._tickets.data;
    }
  }

  actions(ticket) {
    var sheet = this.actionsheet.create({
      title: this.api.trans('literals.actions'),
    });
    sheet.addButton({
      text: this.api.trans('literals.view_resource') + " " + this.api.trans("literals.ticket"),
      handler: () => {
        this.viewTicket(ticket)
      }
    })
    sheet.addButton({
      text: this.api.trans('crud.edit') + " " + this.api.trans("literals.ticket"),
      handler: () => {
        this.editTicket(ticket)
      }
    })

    if (ticket.status != "closed" && ticket.status !== 'rejected') {
      sheet.addButton({
        text: this.api.trans('literals.mark_as') + " " + this.api.trans("literals.closed"),
        handler: () => { }
      })
    }

    sheet.present()
  }

  addTicket() {
    var modal = this.modal.create("TicketEditorPage")
    modal.present();
    modal.onWillDismiss((data) => {
      if (data && data.ticket) {
        this._tickets.data.push(data.ticket);
        this.filter();
      }
    })
  }

  editTicket(ticket) {
    var modal = this.modal.create("TicketEditorPage", { ticket: ticket })
    modal.present();
    modal.onWillDismiss((data) => {
      if (data && data.ticket) {
        ticket = data.ticket;
        this.filter();
      }
    })
  }
  viewTicket(ticket) {
    this.navCtrl.push("TicketPage", { ticket: ticket })
  }

}
