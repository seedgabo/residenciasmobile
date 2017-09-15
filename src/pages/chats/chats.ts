import { Api } from './../../providers/api';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})
export class ChatsPage {
  @ViewChild('scrollMe') private chatBody: ElementRef;
  message = "";
  chat = null;
  loading = false;
  sending = false;
  messages = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.getData();
  }

  getData() {
    this.api.get('messages')
      .then((data: any) => {
        this.api.chats = data;
      })
      .catch((err) => {
        console.error(err)
      });
  }

  send() {
    if (this.message.length === 0) {
      return;
    }
    this.sending = true;
    this.api.put("messages/" + this.chat.id + "?message=" + this.message, {})
      .then((data) => {
        this.messages[this.messages.length] = {
          body: this.message,
          created_at: new Date(),
          user: {
            name: this.api.user.name,
            image_url: this.api.user.image_url,
            residence: {
              name: this.api.residence.name
            }
          }
        };
        this.message = "";
        this.sending = false;
        this.scrolltoBottom();
      })
      .catch(console.error)
  }

  addChat(residence) {
    console.log(residence);
    this.createChat(residence);
  }

  createChat(residence) {
    this.api.post('messages/' + residence.id, {})
      .then((data: any) => {
        console.log(data)
        this.selectChat(data.thread);
        this.getData();
      })
      .catch(console.error)
  }

  selectChat(chat) {
    this.chat = chat
    this.chat.unread = 0
    this.getMessages(chat.id)
    this.scrolltoBottom()
  }

  getMessages(threadId) {
    this.loading = true
    this.messages = []
    this.api.get(`messages/${threadId}`)
      .then((data: any) => {
        console.log('data', data)
        this.messages = data.messages.reverse()
        this.loading = false
        this.scrolltoBottom()

      })
      .catch(console.error)

  }

  scrolltoBottom() {
    setTimeout(() => {
      try {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      } catch (err) { }
    }, 50)
  }
}
