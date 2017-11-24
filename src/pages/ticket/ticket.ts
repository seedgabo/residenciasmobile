import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';
@IonicPage()
@Component({
  selector: 'page-ticket',
  templateUrl: 'ticket.html',
})
export class TicketPage {
  ticket;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {
    this.ticket = navParams.get("ticket")
  }

  ionViewDidLoad() {
    this.getTicket();
  }

  getTicket(){
    this.api.get(`tickets/${this.ticket.id}?with[]=comments&with[]=comments.user&with[]=comments.user.residence`)
    .then((data)=>{
        this.ticket = data;
    })
    .catch((err)=>{
      this.api.Error(err);
    })
  }

}
