import { Api } from './../../providers/api';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { AddChatPage } from '../add-chat/add-chat';

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
  residences = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public api: Api) {
  }

  ionViewDidLoad() {
    this.getData();
    this.events.subscribe("Chat", this.newMessage);
    this.api.get("residences")
      .then((data: any) => {
        this.residences = data;
      })
      .catch(console.error)
  }
  ionViewWillUnload() {
    this.events.unsubscribe("Chat", this.newMessage);
  }

  newMessage(data) {
    if (this.chat && data.thread.id == this.chat.id && data.sender.id != this.api.user.id) {
      var msg = {
        user: data.sender,
        body: data.message.body,
      };
      msg.user.residence = data.residence;
      this.messages.push(msg);
    }
    else if (this.isIn(data.thread.id, this.api.chats, "id")) {
      var length = this.api.chats.length;
      for (var i = 0; i < length; i++) {
        if (this.api.chats[i].id === data.thread.id)
          if (this.api.chats[i].unread)
            this.api.chats[i].unread = 1
          else
            this.api.chats[i].unread++;
      }
    }
    else {
      this.api.chats.push(data.thread);
      this.selectChat(data.thread);
      data.thread.unread = 1;
    }
  }

  isIn(search, array, key) {
    var length = array.length;
    for (var i = 0; i < length; i++) {
      if (search === array[i][key])
        return true
    }
    return false;
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
    this.navCtrl.push(AddChatPage, { residences: this.residences });
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
