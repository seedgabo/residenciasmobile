import { Injectable, NgZone } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { PopoverController, ToastController, Events, Platform, AlertController } from "ionic-angular";
import { Storage } from '@ionic/storage';
import { BackgroundMode } from "@ionic-native/background-mode";
import { OneSignal } from "@ionic-native/onesignal";
import { Device } from "@ionic-native/device";
import { Geolocation } from '@ionic-native/geolocation';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import moment from 'moment';
import { Vibration } from '@ionic-native/vibration';
declare var window: any;
moment.locale('es');
window.Pusher = Pusher;

@Injectable()
export class Api {
  sound: HTMLAudioElement;
  modules: any;
  settings: any;
  Echo: any = undefined;
  url = null;
  // url = "http://localhost/residencias/public/";
  username = "";
  password = "";
  user;
  residence;
  resolve;
  ready: Promise<any> = new Promise((resolve) => {
    this.resolve = resolve;
  });
  langs = {};
  objects: any = {};
  visits = [];
  chats = [];
  _events = [];
  constructor(public http: Http, public storage: Storage, public zone: NgZone, public popover: PopoverController, public toast: ToastController, public events: Events, public background: BackgroundMode, public onesignal: OneSignal, public device: Device, public platform: Platform, public vibration: Vibration, public geolocation: Geolocation, public alert: AlertController) {
    storage.ready().then(() => {
      storage.get('username').then(username => { this.username = username });
      storage.get('password').then(password => { this.password = password });
      storage.get('modules').then(modules => { this.modules = modules });
      storage.get('settings').then(settings => { this.settings = settings });
      storage.get('langs').then(langs => { this.langs = langs; console.log(langs) });
      storage.get('residence').then(residence => { this.residence = residence; });
      storage.get('url').then(url_data => {
        if (url_data)
          this.url = url_data;
        else if (window.url)
          this.url = window.url;
        storage.get('user').then(user => {
          this.user = user
          this.resolve(user);
        });
      });
      storage.get('allData').then((data) => {
        if (!data) return;
        this.residence = data.residence;
        this.objects.visitors = data.visitors;
        this.objects.visits = data.visits;
        this.objects.vehicles = data.vehicles;
        this.objects.workers = data.workers;
        this.objects.users = data.users;
        this.objects.residences = data.residences;
      });
      this.events.subscribe('stopSound', () => {
        if (this.sound)
          this.sound.pause();
      });
      window.$api = this;

    });
  }

  doLogin() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + "api/login", { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe((data: any) => {
          this.user = data.user;
          this.residence = data.residence;
          this.settings = data.settings;
          this.modules = data.modules;

          this.objects.visitors = this.residence.visitors;
          this.objects.visits = this.residence.visits;
          this.objects.vehicles = this.residence.vehicles;
          this.objects.workers = this.residence.workers;
          this.objects.pets = this.residence.pets;
          this.objects.users = this.residence.users;
          this.objects.parkings = this.residence.parkings;
          this.objects.invoices = this.residence.invoices;

          this.storage.set('user', data.user);
          this.storage.set('residence', data.residence);
          this.storage.set('username', this.username);
          this.storage.set('password', this.password);
          this.storage.set('modules', this.modules);
          this.storage.set('settings', this.settings);
          this.getLang();

          this.saveSharedPreferences();
          resolve(data);
        }, error => {
          return reject(error);
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
      this.user.residence_id = data.residence.id;
      this.objects.visitors = data.visitors;
      this.objects.visits = data.visits;
      this.objects.vehicles = data.vehicles;
      this.objects.workers = data.workers;
      this.objects.pets = data.pets;
      this.objects.users = data.users;
      this.user.residences = data.residences;
      this.objects.parkings = data.parkings;
      this.objects.invoices = data.invoices;
      this.objects.residences = data.residences;

      this.modules = data.modules;
      this.settings = data.settings;

      this.saveData(data);
      this.storage.set('allData', data);
      this.pushRegister(this.user.onesignal_appId);
      this.saveSharedPreferences();
    }).catch((err) => {
      console.error(err);
    });
    return promise;
  }

  load(resource) {
    console.time("load " + resource)
    return new Promise((resolve, reject) => {
      if (this.objects[resource] && this.objects[resource].promise) {
        this.objects[resource].promise
          .then((resp) => {
            resolve(resp);
            console.timeEnd("load " + resource)
          })
          .catch(reject)
        return
      }
      this.storage.get(resource + "_resource")
        .then((data) => {
          this.objects[resource] = []
          if (data) {
            this.objects[resource] = data;
          }
          var promise, query = "";
          if (resource == 'users' || resource == 'workers' || resource == 'visitors' || resource == 'pets') {
            query = "?where[residence_id]=" + this.user.residence_id + "&with[]=residence"
          }
          if (resource == 'vehicles') {
            query = "?where[residence_id]=" + this.user.residence_id + "&with[]=owner&with[]=visitor&with[]=residence"
          }
          if (resource == 'parkings') {
            query = "?with[]=user"
          }
          if (resource == 'products') {
            query = "?with[]=category"
          }
          if (resource == 'residences') {
            query = "?with[]=owner&with[]=users"
          }
          this.objects[resource].promise = promise = this.get(resource + query)
          this.objects[resource].promise.then((resp) => {
            this.objects[resource] = resp;
            this.objects[resource].promise = promise;
            this.objects[resource].collection = this.mapToCollection(resp);
            this.storage.set(resource + "_resource", resp);
            console.timeEnd("load " + resource)
            return resolve(this.objects[resource]);
          })
            .catch((err) => {
              reject(err);
              this.Error(err)
            })
        })
    })
  }

  get(uri) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(error);
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
          return reject(error);
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
          return reject(error);
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
          return reject(error);
        });
    });
  }

  private mapToCollection(array, key = "id") {
    var collection = {}
    array.forEach(element => {
      collection[element[key]] = element
    });
    return collection;
  }

  saveData(userData) {
    this.user = userData.user;
    this.user.residences = userData.residences;
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
          return reject(error);
        });
    });
  }

  startEcho() {
    this.ready.then(() => {
      if (this.Echo) {
        console.warn('already started Echo');
        this.stopEcho()
      }
      console.log("echo to:", this.user.hostEcho);
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

        // User Events
        .listen('UserCreated', (data) => {
          console.log("created user:", data);
          this.UserChanged(data)
        })
        .listen('UserUpdated', (data) => {
          console.log("updated user:", data);
          this.UserChanged(data)
        })
        .listen('UserDeleted', (data) => {
          console.log("deleted user:", data);
          this.resourceDeleted(data, 'users', 'user');
        })
        // Parking Events
        .listen('ParkingCreated', (data) => {
          console.log("created parking:", data);
          this.ParkingChanged(data);
        })
        .listen('ParkingUpdated', (data) => {
          console.log("updated parking:", data);
          this.ParkingChanged(data);
        })
        .listen('ParkingDeleted', (data) => {
          console.log("deleted parking:", data);
          this.resourceDeleted(data, 'parkings', 'parking')
        })
        // Visitor Events
        .listen('VisitorCreated', (data) => {
          console.log("created visitor:", data);
          this.VisitorChanged(data)
        })
        .listen('VisitorUpdated', (data) => {
          console.log("updated visitor:", data);
          this.VisitorChanged(data)
        })
        .listen('VisitorDeleted', (data) => {
          this.resourceDeleted(data, 'visitors', 'visitor')
        })
        // Vehicle Events
        .listen('VehicleCreated', (data) => {
          console.log("created vehicle:", data);
          this.VehicleChanged(data);
        })
        .listen('VehicleUpdated', (data) => {
          console.log("updated vehicle:", data);
          this.VehicleChanged(data);
        })
        .listen('VehicleDeleted', (data) => {
          console.log("deleted vehicle:", data);
          this.resourceDeleted(data, 'vehicles', 'vehicle')
        })
        // Worker Events
        .listen('WorkerCreated', (data) => {
          console.log("created worker:", data);
          this.WorkerChanged(data)
        })
        .listen('WorkerUpdated', (data) => {
          console.log("updated worker", data.worker)
          this.WorkerChanged(data)
        })
        .listen('WorkerDeleted', (data) => {
          console.log("deleted worker:", data);
          this.resourceDeleted(data, 'workers', 'worker')
        })

        .listen('PetCreated', (data) => {
          console.log("created pet:", data);
          this.PetChanged(data)
        })
        .listen('PetUpdated', (data) => {
          console.log("updated pet", data.pet)
          this.PetChanged(data)
        })
        .listen('PetDeleted', (data) => {
          console.log("deleted pet:", data);
          this.resourceDeleted(data, 'pets', 'pet')
        })

        .listen('VisitCreated', (data) => {
          if (data.visit.residence_id != this.residence.id) return;
          console.log("created vist:", data);

          this.zone.run(() => {
            if (this.visits)
              this.visits.unshift(data.visit);
            var visit = this.visits[0];
            visit.visitor = data.visitor;
            visit.guest = data.guest;
            visit.visitors = data.visitors;
            visit.creator = data.creator;
            this.visitStatus(visit);
          })
        })
        .listen('VisitUpdated', (data) => {
          console.log("updated visit:", data);
          if (data.visit.residence_id !== this.residence.id) return;
          data.visit.visitor = data.visitor;
          data.visit.guest = data.guest;
          data.visit.visitors = data.visitors;
          this.events.publish('VisitUpdated', data);

          var visit_index = this.visits.findIndex((visit) => {
            return visit.id === data.visit.id;
          });
          this.zone.run(() => {
            var visit;
            if (visit_index > -1) {
              visit = this.visits[visit_index] = data.visit;
              if (this.visits[visit_index].status !== data.visit.status) {
                this.visitStatus(visit);
              }
            }
            else {
              this.visits.unshift(data.visit);
              visit = this.visits[0];
              this.visitStatus(visit);
            }

          });
        })
        .listen('VisitDeleted', (data) => {
          console.log("deleted visitor:", data);
          if (data.visit.residence_id != this.residence.id) return;

          var visit = this.visits.findIndex((visit) => {
            return visit.id === data.visit.id;
          });
          this.zone.run(() => {
            if (visit >= 0) {
              this.visits.splice(visit, 1);
            }
          })
        })

        .listen('EventCreated', (data) => {
          if (!(data.event.privacity == "public" || data.event.creator.residece_id == this.user.residence_id)) return;
          console.log("created event:", data);
          this.zone.run(() => {
            this._events[this._events.length] = data.event
          })
          this.events.publish("events:changed", {});
        })
        .listen('EventUpdated', (data) => {
          console.log("updated event:", data);
          if (!(data.event.privacity == "public" || data.event.creator.residece_id == this.user.residence_id)) return;
          var event_index = this._events.findIndex((ev) => {
            return ev.id === data.event.id;
          });
          this.zone.run(() => {
            if (event_index > -1)
              this._events[event_index] = data.event;
          });
          this.events.publish("events:changed", {});

        })
        .listen('EventDeleted', (data) => {
          console.log("deleted event:", data);

          var event = this.visits.findIndex((event) => {
            return event.id === data.event.id;
          });
          this.zone.run(() => {
            if (event >= 0) {
              this.visits.splice(event, 1);
            }
          })
          this.events.publish("events:changed", {});

        })

        .listen('SurveyCreated', (data) => {
          console.log("created survey:", data);
          this.events.publish('survey:created', data)
        })
        .listen('SurveyUpdated', (data) => {
          console.log("updated survey:", data);
          this.events.publish('survey:updated', data)

        })
        .listen('SurveyDeleted', (data) => {
          console.log("deleted survey:", data);
          this.events.publish('survey:deleted', data)

        })

      this.Echo.private('App.Residence.' + this.user.residence_id)
        .listen('VisitConfirm', (data) => {
          console.log("VisitConfirm: ", data);
          data.visit.visitor = data.visitor;
          data.visit.guest = data.guest;
          data.visit.visitors = data.visitors;
          data.visit.creator = data.creator;
          this.background.unlock();
          this.background.wakeUp();
          this.background.moveToForeground();
          this.newVisit(data.visit);
        })

      this.Echo.private('App.User.' + this.user.id)
        .listen('Chat', (data) => {
          console.log("new chat event", data);
          var thread = data.thread
          var message = data.message
          var sender = data.sender
          var residence = data.residence
          this.newChatMessage(thread, message, sender)
          this.events.publish('Chat', { thread: thread, message: message, sender: sender, residence: residence });
        })
        .notification((notification) => {
          console.log(notification);
        });

      this.Echo.join('App.Mobile')
        .here((data) => {
          console.log("here:", data);
        })
        .joining((data) => {
          console.log("joining", data);
        })
        .leaving((data) => {
          console.log("leaving", data);
        })



      // console.log(this.Echo);
    })
  }
  stopEcho() {
    this.Echo.leave('Application');
    this.Echo.leave('App.User.' + this.user.id);
    this.Echo.leave('App.Residence.' + this.user.residence_id);
    this.Echo.leave('App.Mobile');
    this.Echo = undefined;
  }

  pushRegister(appid = "ebf07feb-3c76-4639-8c87-b1e7a2e9ddd8") {
    this.onesignal.startInit(appid, "425679220353");
    this.onesignal.inFocusDisplaying(this.onesignal.OSInFocusDisplayOption.Notification);
    this.onesignal.sendTags({
      user_id: this.user.id,
      residence_id: this.user.residence_id,
      app_name: this.user.onesignal_app_name
    });

    this.onesignal.handleNotificationReceived().subscribe((not) => {
      console.log("push notification received", not);
    }, console.warn);
    this.onesignal.handleNotificationOpened().subscribe((not) => {
      console.log("push notification opened", not);
    }, console.warn);
    this.onesignal.syncHashedEmail(this.user.email);
    this.onesignal.endInit();

    this.onesignal.getIds().then((ids: any) => {
      console.log("onesignal ids", ids)
      var data = {
        token_id: ids.userId,
        user_id: this.user.id,
        platform: this.device.platform,
        model: this.device.model,
        version: this.device.version,
      };
      this.post('register-push-device', data)
        .then((response) => {
          console.log('device registered:', response);
        })
        .catch((error) => this.Error(error));
    }).catch((error) => console.warn(error));
  }

  pushUnregister() {
    this.onesignal.deleteTags(['user_id', 'residence_id', 'app_name']);
  }


  trans(value, args = null) {
    if (!this.langs) return value;
    var splits = value.split('.');
    var base, trans;
    if (splits.length == 2) {
      base = this.langs[splits[0]];
      if (base) {
        trans = base[splits[1]];
        if (trans) {
          value = trans;
        }
      }
    } else {
      base = this.langs["__"];
      if (base) {
        trans = base[value];
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
    return value.replace('literals.', '').replace('__.', '');
  }


  private setHeaders() {
    let headers = new Headers();
    if (this.user && this.user.token)
      headers.append("Auth-Token", this.user.token);
    else
      headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
    return headers;
  }


  newVisit(visit) {
    this.playSoundNotfication();
    this.moveToFront();
    this.popover.create('NewVisitPage', { visit: visit, api: this }, { cssClass: "fullScreen", enableBackdropDismiss: false, showBackdrop: true }).present();
  }

  visitStatus(visit) {
    if (visit.status == 'waiting for confirmation') { return }
    this.toast.create({
      message: this.trans("literals.visit") + " " + this.trans('literals.' + visit.status) + ": " + (visit.visitor ? visit.visitor.name : visit.guest ? visit.guest.name : ''), duration: 12000, showCloseButton: true, closeButtonText: "X", position: "top", cssClass: visit.status
    }).present();
    this.playSoundBeep();
  }

  newChatMessage(thread, message, sender) {
    if (this.user.id !== sender.id) {
      var sender = sender;
      var msg = message;
      this.toast.create({
        message: `${thread.title} - ${sender.name}: ${msg}`,
        closeButtonText: "X",
        showCloseButton: true,
        duration: 2000,
        position: "top"
      }).present();
    }

    this.chats.forEach((chat) => {
      if (thread.id == chat.id) {
        if (!chat.unread) chat.unread = 1;
        chat.unread++;
      }
    });
    this.sound = new Audio('assets/sounds/chat.mp3');
    this.sound.play();
    return this.sound;
  }


  moveToFront() {
    this.background.unlock();
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

  playSoundChat() {
    this.sound = new Audio('assets/sounds/chat.mp3');
    this.sound.play();
    return this.sound;
  }

  panic() {
    var data = {
      user: this.user,
      location: null,
    }
    var promise = this.post('panic', data)
    promise
      .then((data) => {
        console.log("panic sent:", data)
        this.toast.create({
          message: this.trans("__.panico enviado"),
          duration: 5000,
          position: 'top',
        }).present();

        this.getLocationForPanic(data);

        this.vibration.vibrate(300)
        setTimeout(() => {
          this.vibration.vibrate(300)
        }, 600);
      })
      .catch((err) => {
        console.error(err)
        this.toast.create({
          message: this.trans("__.error enviado el panico"),
          duration: 5000,
          position: 'top',
        }).present();

      })
    return promise;
  }

  Error(error) {
    console.error(error)
    var message = "";
    if (error.status == 500) {
      message = this.trans("__.Internal Server Error")
    }
    if (error.status == 404) {
      message = this.trans("__.Not Found")
    }
    if (error.status == 401) {
      message = this.trans("__.Unauthorized")
    }
    this.alert.create({
      title: this.trans("__.Network Error"),
      subTitle: error.error,
      message: message + ":" + error.statusText,
      buttons: ["OK"],

    }).present();
  }

  getLocationForPanic(data) {
    this.geolocation.getCurrentPosition({
      enableHighAccuracy: true,

    })
      .then((resp) => {
        var locs = {
          accuracy: resp.coords.accuracy,
          altitude: resp.coords.altitude,
          latitude: resp.coords.latitude,
          longitude: resp.coords.longitude,
          speed: resp.coords.speed,
          heading: resp.coords.heading,
          altitudeAccuracy: resp.coords.altitudeAccuracy,
          timestamp: resp.timestamp,
        }
        this.put("panics/" + data.id, { location: locs })
          .then((dataL) => {
            console.log("panic with locs", dataL)
          })
          .catch((err) => {
            console.error("error sending panic with location", err);
          })

      }).catch((error) => {
        console.log('Error getting location', error);
      });
  }

  saveSharedPreferences() {
    try {
      if (!this.platform.is('android'))
        return;
      var prefs = window.SharedPreferences
      prefs.getSharedPreferences('residentes_online', 'MODE_PRIVATE', () => {
        prefs.putString('url', this.url)
        prefs.putString('token', this.user.token)
        prefs.putString('user_id', this.user.id)
        prefs.putString('residence_id', this.user.residence_id)
      }, console.error);

    }
    catch (e) {
      console.error("catch error saving shared pref", e)
    }
  }

  clearSharedPreferences() {
    try {
      if (!this.platform.is('android'))
        return;
      var prefs = window.SharedPreferences
      prefs.getSharedPreferences('residentes_online', 'MODE_PRIVATE', () => {
        prefs.remove('url')
        prefs.remove('token')
        prefs.remove('user_id')
        prefs.remove('residence_id')
      }, console.error);
    }
    catch (e) {
      console.error("catch error saving shared pref", e)
    }

  }





  public UserChanged(data) {
    if (this.objects.users) {
      var user_index = this.objects.users.findIndex((user) => {
        return user.id === data.user.id;
      });
      this.zone.run(() => {
        var user;
        if (user_index > -1) {
          user = Object.assign(this.objects.users[user_index], data.user)
          this.objects.users.collection[user.id] = data.user;
        }

        else {
          user = this.objects.users[this.objects.users.length] = data.user;
        }
        if (data.residence)
          user.residence = data.residence;
        if (data.image)
          user.image = data.image;
      });
    }
  }
  public VisitorChanged(data) {
    if (this.objects.visitors) {
      var visitor_index = this.objects.visitors.findIndex((visitor) => {
        return visitor.id === data.visitor.id;
      });
      this.zone.run(() => {
        var visitor;
        if (visitor_index > -1) {
          visitor = Object.assign(this.objects.visitors[visitor_index], data.visitor)
          this.objects.visitors.collection[visitor.id] = data.visitor;
        }
        else {
          visitor = this.objects.visitors[this.objects.visitors.length] = data.visitor;
        }

        if (data.image)
          visitor.image = data.image;
        if (data.residence)
          visitor.residence = data.residence;
      });

    }
  }
  public VehicleChanged(data) {
    if (this.objects.vehicles) {
      var vehicle_index = this.objects.vehicles.findIndex((vehicle) => {
        return vehicle.id === data.vehicle.id;
      });
      this.zone.run(() => {
        var vehicle;
        if (vehicle_index > -1) {
          vehicle = Object.assign(this.objects.vehicles[vehicle_index], data.vehicle)
          this.objects.vehicles.collection[vehicle.id] = data.vehicle;
        }
        else {
          vehicle = this.objects.vehicles[this.objects.vehicles.length] = data.vehicle;
        }
        if (data.residence)
          vehicle.residence = data.residence;
        if (data.owner)
          vehicle.owner = data.owner;
        if (data.visitor)
          vehicle.visitor = data.visitor;
        if (data.image)
          vehicle.image = data.image;
      });
    }
  }
  public ParkingChanged(data) {
    if (this.objects.parkings) {
      var parking_index = this.objects.parkings.findIndex((parking) => {
        return parking.id === data.parking.id;
      });
      this.zone.run(() => {
        var parking;
        if (parking_index > -1) {
          parking = Object.assign(this.objects.parkings[parking_index], data.parking)
          this.objects.parkings.collection[parking.id] = data.parking;
        }
        else {
          parking = this.objects.parkings[this.objects.parkings.length] = data.parking;
        }
        if (data.image)
          parking.image = data.image;
        if (data.residence)
          parking.residence = data.residence;
      });
    }
  }
  public WorkerChanged(data) {
    if (this.objects.workers) {
      var worker_index = this.objects.workers.findIndex((worker) => {
        return worker.id === data.worker.id;
      });
      this.zone.run(() => {
        var worker;
        if (worker_index > -1) {
          worker = Object.assign(this.objects.workers[worker_index], data.worker)
          this.objects.workers.collection[worker.id] = data.worker;
        }
        else {
          worker = this.objects.workers[this.objects.workers.length] = data.worker;
        }
        if (data.image)
          worker.image = data.image;
        if (data.residence)
          worker.residence = data.residence;
      });
    }
  }
  public PetChanged(data) {
    if (this.objects.pets) {
      var pet_index = this.objects.pets.findIndex((pet) => {
        return pet.id === data.pet.id;
      });
      this.zone.run(() => {
        var pet;
        if (pet_index > -1) {
          pet = Object.assign(this.objects.pets[pet_index], data.pet)
          this.objects.pets.collection[pet.id] = data.pet;
        }
        else {
          pet = this.objects.pets[this.objects.pets.length] = data.pet;
        }
        if (data.image)
          pet.image = data.image;
        if (data.residence)
          pet.residence = data.residence;
      });
    }
  }
  public VisitChanged(data) {
    var visit_index = this.visits.findIndex((visit) => {
      return visit.id === data.visit.id;
    });
    this.zone.run(() => {
      var visit;
      if (visit_index > -1) {
        visit = this.visits[visit_index] = data.visit;
      }
      else {
        this.visits.unshift(data.visit);
        visit = this.visits[0];
      }
      if (data.visitor) {
        visit.visitor = data.visitor;
        visit.visitors = data.visitors;
        visit.guest = data.guest;
        if (this.objects.residences)
          visit.residence = this.objects.residences.collection[visit.residence_id];
      }
    });
  }


  public resourceDeleted(data, resource, item) {
    var item_index = this.objects[resource].findIndex((i) => {
      return i.id === data[item].id;
    });
    if (this.objects[resource])
      this.zone.run(() => {
        if (item_index >= 0) {
          this.objects[resource].splice(item_index, 1);
          delete (this.objects[resource][data[item].id])
        }
      })
  }
}
