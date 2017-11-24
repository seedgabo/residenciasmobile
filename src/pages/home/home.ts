import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from "../../providers/api";

// import { Camera, CameraOptions } from '@ionic-native/camera';


import { IonicPage } from "ionic-angular";

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
  constructor(public navCtrl: NavController, public api: Api) {
  }

  ionViewDidLoad() {
    this.api.startEcho();
    this.getSliders();
    this.getNextEvents()
    this.getNews();
    // this.getCorrespondences();
  }

  ionViewDidEnter() {
    this.getCorrespondences();
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
  gotoTickets(){
    this.navCtrl.push('TicketsPage');

  }

  gotoCorrespondences() {
    this.navCtrl.push('CorrespondencesPage');
  }
  gotoPost(post) {
    this.navCtrl.push("PostPage", { post: post });
  }

}

