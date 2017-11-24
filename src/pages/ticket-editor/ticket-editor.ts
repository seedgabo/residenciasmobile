import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';
import { ViewController } from 'ionic-angular/navigation/view-controller';
@IonicPage()
@Component({
  selector: 'page-ticket-editor',
  templateUrl: 'ticket-editor.html',
})
export class TicketEditorPage {
  ticket:any = {
    subject: "",
    text: "",
    status: "open",
    user_id: this.api.user.id,
    residence_id: this.api.user.residence_id,
  }
  statuses = [
    "open",
    "closed",
    "in proccess",
    "rejected"
  ]
  loading = false
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewctrl:ViewController, public api:Api) {
    this.ticket = navParams.get('ticket')
  }

  ionViewDidLoad() {
  }

  canSave() {
    return this.ticket.subject.length > 1 &&
      this.ticket.text.length > 1
  }

  save() {
    var promise: Promise<any>;
    this.loading = true;
    if (this.ticket.id) {
      promise = this.api.put('tickets/' + this.ticket.id, this.ticket);
    } else {
      promise = this.api.post('tickets', this.ticket);
    }
    promise.then((data) => {
      this.ticket = data;
      this.loading = false;
      this.viewctrl.dismiss({ticket:data});
    })
      .catch((err) => {
        this.loading = false;
        this.api.Error(err);
        console.error(err);
      })
  }

  dismiss() {
    this.viewctrl.dismiss();
  }

}
