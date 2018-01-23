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
  ticket: any = {
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    if (navParams.get('ticket')) {
      this.ticket = navParams.get('ticket')
    }
  }

  ionViewDidLoad() {
    console.log(this.ticket)
  }

  canSave() {
    return this.ticket.subject.length > 1 &&
      this.ticket.text.length > 1
  }

  save() {
    var promise: Promise<any>;
    this.loading = true;
    var data = {
      status: this.ticket.status,
      text: this.ticket.text,
      subject: this.ticket.subject,
      user_id: this.ticket.user_id,
      residence_id: this.ticket.residence_id,
    }
    if (this.ticket.id) {
      promise = this.api.put('tickets/' + this.ticket.id, data);
    } else {
      promise = this.api.post('tickets', data);
    }
    promise.then((data) => {
      this.loading = false;
      this.viewctrl.dismiss({ ticket: data });
      this.ticket.id = data.id;
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
