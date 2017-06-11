import { Injectable, NgZone } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import Echo from 'laravel-echo';
declare var window: any;
import Pusher from 'pusher-js';
import { PopoverController, ToastController, Events } from "ionic-angular";
import { NewVisitPage } from "../pages/new-visit/new-visit";
import { BackgroundMode } from "@ionic-native/background-mode";
import moment from 'moment';
moment.locale('es');
window.Pusher = Pusher;

@Injectable()
export class Api {
  sound: HTMLAudioElement;
  modules: any;
  settings: any;
  Echo: any;
  url = "http://residenciasonline.com/residencias/public/";
  username = "seedgabo@gmail.com";
  password = "gab23gab";
  user;
  residence;
  resolve;
  ready: Promise<any> = new Promise((resolve) => {
    this.resolve = resolve;
  });
  langs = {};
  workers = [];
  vehicles = [];
  visitors = [];
  residences = [];
  users = [];
  parkings = [];
  visits = [];
  constructor(public http: Http, public storage: Storage, public zone: NgZone, public popover: PopoverController, public toast: ToastController, public events: Events, public background: BackgroundMode) {
    storage.ready().then(() => {
      storage.get('username').then(username => { this.username = username });
      storage.get('password').then(password => { this.password = password });
      storage.get('modules').then(modules => { this.modules = modules });
      storage.get('settings').then(settings => { this.settings = settings });
      storage.get('langs').then(langs => { this.langs = langs; console.log(langs) });
      storage.get('residence').then(residence => { this.residence = residence; });
      storage.get('user').then(user => {
        this.user = user
        this.resolve(user);
      });
      this.events.subscribe('stopSound', () => {
        if (this.sound)
          this.sound.pause();
      });

    });
  }

  doLogin() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + "api/login", { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
          this.user = data.user;
          this.residence = data.residence;
          this.settings = data.settings;
          this.modules = data.modules;
          this.storage.set('user', data.user);
          this.storage.set('residence', data.residence);
          this.storage.set('username', this.username);
          this.storage.set('password', this.password);
          this.storage.set('modules', this.modules);
          this.storage.set('settings', this.settings);
          this.getLang();
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  getLang() {
    this.get('lang')
      .then((langs) => {
        console.log(langs);
        this.storage.set('langs', langs);
        this.langs = langs;
      })
      .catch((err) => {
        console.error('error trying to download translations', err);
      })
  }

  getAllData() {
    var promise = this.get('getData');
    promise.then((data: any) => {
      console.log(data);
      this.residence = data.residence;
      this.visitors = data.visitors;
      this.visits = data.visits;
      this.vehicles = data.vehicles;
      this.workers = data.workers;
      this.users = data.users;
      this.residences = data.residences;
    }).catch((err) => {
      console.error(err);
    });
    return promise;
  }

  get(uri) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  post(uri, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + "api/" + uri, data, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  put(uri, data) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + "api/" + uri, data, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  delete(uri) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  saveData(userData) {
    this.user = userData.user;
    this.settings = userData.settings;
    this.modules = userData.modules;
    this.storage.set('user', this.user);
    this.storage.set('modules', this.modules);
    this.storage.set('settings', this.settings);
    this.getLang();
  }

  loginOAuth(userData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + "api/login/oauth", userData, {})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  startEcho() {
    this.ready.then(() => {
      this.Echo = new Echo({
        key: '807bbfb3ca20f7bb886e',
        authEndpoint: this.url + 'broadcasting/auth',
        broadcaster: 'socket.io', // pusher o socket.io
        host: this.user.hostEcho,
        // host: "http://localhost:6001",
        // encrypted: false,
        // cluster: 'eu',
        auth:
        {
          headers:
          {
            'Auth-Token': this.user.token,
            'Authorization': "Basic " + btoa(this.username + ":" + this.password)
          }
        }

      });
      this.Echo.private('Application')
        .listen('ParkingCreated', (data) => {
          console.log("created parking:", data);
          this.zone.run(() => {
            data.parking.user = data.user;
            data.parking.residence = data.residence;
            this.parkings[this.parkings.length] = data.parking;
          })
        })
        .listen('ParkingUpdated', (data) => {
          console.log("updated parking:", data);
          var parking = this.parkings.findIndex((parking) => {
            return parking.id === data.parking.id;
          });
          this.zone.run(() => {
            data.parking.user = data.user;
            data.parking.residence = data.residence;
            if (parking >= 0) {
              this.parkings[parking] = data.parking;

            }
            else {
              this.parkings[this.parkings.length] = data.parking;
            }
          });
        })
        .listen('ParkingDeleted', (data) => {
          console.log("deleted parking:", data);
          var parking = this.parkings.findIndex((parking) => {
            return parking.id === data.parking.id;
          });
          this.zone.run(() => {
            if (parking >= 0) {
              this.parkings.splice(parking, 1);
            }
          })
        })

        .listen('VisitorCreated', (data) => {
          console.log("created visitor:", data);
          if (data.visitor.residence_id != this.residence.id) return;
          this.zone.run(() => {
            var visitor = this.visitors[this.visitors.length] = data.visitor;
            if (data.image)
              visitor.image = data.image;
          })
        })
        .listen('VisitorUpdated', (data) => {
          console.log("updated visitor:", data);
          if (data.visitor.residence_id != this.residence.id) return;
          var visitor_index = this.visitors.findIndex((visitor) => {
            return visitor.id === data.visitor.id;
          });
          this.zone.run(() => {
            if (visitor_index > -1)
              var visitor = this.visitors[visitor_index] = data.visitor;
            else {
              var visitor = this.visitors[this.visitors.length] = data.visitor;
            }
            if (data.image) {
              visitor.image = data.image;
            }
          });
        })
        .listen('VisitorDeleted', (data) => {
          console.log("deleted visitor:", data);
          var visitor = this.visitors.findIndex((visitor) => {
            return visitor.id === data.visitor.id;
          });
          this.zone.run(() => {
            if (visitor >= 0) {
              this.visitors.splice(visitor, 1);
            }
          })
        })


        .listen('VisitCreated', (data) => {
          if (data.visitor.residence_id != this.residence.id) return;
          console.log("created vist:", data);

          this.zone.run(() => {
            this.visits.unshift(data.visit);
            var visit = this.visits[0];
            if (data.visitor)
              visit.visitor = data.visitor;
            this.visitStatus(visit);
          })
        })
        .listen('VisitUpdated', (data) => {
          console.log("updated visit:", data);
          if (data.visitor.residence_id != this.residence.id) return;
          this.events.publish('VisitUpdated', data);
          var visit_index = this.visits.findIndex((visit) => {
            return visit.id === data.visit.id;
          });
          this.zone.run(() => {
            if (visit_index > -1)
              var visit = this.visits[visit_index] = data.visit;
            else {
              this.visits.unshift(data.visit);
              var visit = this.visits[0];
            }
            if (data.visitor) {
              visit.visitor = data.visitor;
            }
            this.visitStatus(visit);

          });
        })
        .listen('VisitDeleted', (data) => {
          console.log("deleted visitor:", data);
          if (data.visitor.residence_id != this.residence.id) return;

          var visit = this.visits.findIndex((visit) => {
            return visit.id === data.visit.id;
          });
          this.zone.run(() => {
            if (visit >= 0) {
              this.visits.splice(visit, 1);
            }
          })
        })

      this.Echo.private('App.Residence.' + this.user.residence_id)
        .listen('VisitConfirm', (data) => {
          console.log("VisitConfirm: ", data);
          this.newVisit(data.visit, data.visitor);
        })

      this.Echo.private('App.User.' + this.user.id)
        .notification((notification) => {
          console.log(notification);
        });

      // console.log(this.Echo);
    })
  }

  stopEcho() {
    this.Echo.leave('Application');
    this.Echo.leave('App.User.' + this.user.id);
    this.Echo = undefined;
  }

  trans(value, args = null) {
    if (!this.langs) return value;
    var splits = value.split('.');
    if (splits.length == 2) {
      var base = this.langs[splits[0]];
      if (base) {
        var trans = base[splits[1]];
        if (trans) {
          value = trans;
        }
      }
    } else {
      var base = this.langs["__"];
      if (base) {
        var trans = base[value];
        if (trans) {
          value = trans;
        }
      }
    }
    if (args) {
      for (var k in args) {
        value = value.replace(':' + k, args[k]);
      }
    }
    return value;
  }



  private setHeaders() {
    let headers = new Headers();
    if (this.user && this.user.token)
      headers.append("Auth-Token", this.user.token);
    else
      headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
    return headers;
  }

  private handleData(res) {
    if (res.statusText == "Ok") {
      return { status: "No Parace haber conexión con el servidor" };
    }

    // If request fails, throw an Error that will be caught
    if (res.status < 200 || res.status >= 300) {
      return { error: res.status }
    }
    // If everything went fine, return the response
    else {
      return res;
    }
  }

  newVisit(visit, visitor) {
    this.playSoundNotfication();
    this.moveToFront();
    this.popover.create(NewVisitPage, { visit: visit, visitor: visitor, api: this }, { cssClass: "fullScreen", enableBackdropDismiss: false, showBackdrop: true }).present();
  }

  visitStatus(visit) {
    if (visit.status == 'waiting for confirmation') { return }
    this.toast.create({ message: this.trans("literals.visit") + " " + this.trans('literals.' + visit.status) + ": " + visit.visitor.name, duration: 12000, showCloseButton: true, closeButtonText: "X", position: "top", cssClass: visit.status }).present();
    this.playSoundBeep();
  }

  moveToFront() {
    this.background.wakeUp();
    this.background.moveToForeground();
  }


  playSoundNotfication() {
    this.sound = new Audio('assets/sounds/notifcations.mp3');
    this.sound.play();
    return this.sound;
  }

  playSoundBeep() {
    this.sound = new Audio('assets/sounds/beep.mp3');
    this.sound.play();
    return this.sound;
  }

}
