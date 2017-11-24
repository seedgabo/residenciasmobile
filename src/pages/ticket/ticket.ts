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
  new_comment = {
    text: "",
    user_id: this.api.user.id
  }
  loading = false;
  adding =false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api:Api) {
    this.ticket = navParams.get("ticket")
  }

  ionViewDidLoad() {
    this.getTicket();
  }

  getTicket(){
    this.loading = true;
    this.api.get(`tickets/${this.ticket.id}?with[]=comments&with[]=comments.user&with[]=comments.user.residence`)
    .then((data)=>{
        this.loading = false;
        this.ticket = data;
      })
      .catch((err)=>{
        this.api.Error(err);
        this.loading = false;
    })
  }

  canAddComment(){
    return this.new_comment.text.length > 3;
  }

  addComment(){
      this.loading = true;
      this.api.post("comments",this.new_comment)
      .then((data)=>{
          this.ticket.comments.push(data);
          this.loading=false;
          this.new_comment.text = "";
          this.adding = false;
      })
      .catch((err)=>{
        this.api.Error(err);
        this.loading=false;
      })
  }

}
