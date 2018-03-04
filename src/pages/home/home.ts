import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from "../../providers/api";

// import { Camera, CameraOptions } from '@ionic-native/camera';


import { IonicPage } from "ionic-angular";
import { PopoverMenu } from '../popover/popover-menu';

declare var window: any;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  sliders = [];
  text = "";
  nextEvents = [];
  news = [];
  correspondences = [];
  constructor(public navCtrl: NavController, public api: Api, public popovermenu: PopoverMenu) {
  }

  ionViewDidLoad() {
    this.api.startEcho();
  }

  ionViewDidEnter() {
    this.api.ready.then(() => {
      this.getCorrespondences();
      this.getSliders();
      this.getNextEvents()
      this.getNews();
    })
  }

  getSliders() {
    this.api.storage.get('sliders').then((sliders) => {
      if (sliders)
        this.sliders = sliders;
      this.api.get("sliders?with[]=image")
        .then((data: any) => {
          this.api.storage.set('sliders', data);
          console.log(data);
          this.sliders = data;
        })
        .catch((error) => {
          console.error("error trayendo los sliders:", error);
        });
    });

  }
  getNextEvents() {
    this.api.get('events?scope[soon]')
      .then((data: any) => {
        this.nextEvents = data;
      })
      .catch((err) => {
        console.error(err);
      });
  }
  getNews() {
    this.api.get('posts?order[created_at]=desc&limit=7&with[]=user.residence&with[]=image')
      .then((data: any) => {
        console.log("news", data);
        this.news = data;
      })
      .catch((err) => {
      });
  }
  gotoNews() {
    this.navCtrl.push('PostsPage');
  }
  gotoInvoices() {
    this.navCtrl.push('InvoicesPage')
  }
  gotoProfile() {
    this.navCtrl.push('ProfilePage');
  }
  gotoCalendar(event) {
    this.navCtrl.push('EventsPage', { event: event });
  }
  getCorrespondences() {
    this.api.ready.then(() => {
      if (this.api.modules.correspondences) {
        this.api.get(`correspondences?where[residence_id]=${this.api.user.residence_id}&where[status]=arrival`)
          .then((data: any) => {
            console.log(data);
            this.correspondences = data
            this.api.user.correspondences = data
          })
          .catch(console.error)
      }
    })
  }
  gotoTickets() {
    this.navCtrl.push('TicketsPage');

  }

  gotoCorrespondences() {
    this.navCtrl.push('CorrespondencesPage');
  }
  gotoPost(post) {
    this.navCtrl.push("PostPage", { post: post });
  }



  presentPopover(Ev) {
    let popover = this.popovermenu.create({
      title: this.api.trans('literals.options'),
      buttons: [
        {
          text: this.api.trans('literals.admin'),
          handler: () => {
            window.location.href = this.api.url + 'admin';
          },
        },
        {
          text: this.api.trans('literals.profile'),
          handler: () => {
            this.navCtrl.push('ProfilePage')
          },
        },
        {
          text: this.api.trans('__.Cerrar Sesión'),
          handler: () => {
            this.logout();
          },
        },
      ]
    });
    popover.present({ ev: Ev })
  }

  logout() {
    this.api.storage.clear().then(() => {
      this.navCtrl.setRoot('Login').then(() => {
        this.api.stopEcho();
        this.api.username = ""
        if (!window.url) {
          this.api.url = ""
        };
        this.api.user = null;
        this.api.password = ""
        this.api.residence = null;
        this.api.pushUnregister();
        this.api.clearSharedPreferences();
      });
    });
  }
}

