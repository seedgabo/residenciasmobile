import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush } from "@ionic-native/code-push";
import { BackgroundMode } from '@ionic-native/background-mode';
import { Deeplinks } from "@ionic-native/deeplinks";
import { Api } from "../providers/api";
import { AppMinimize } from "@ionic-native/app-minimize";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  see_residences = false
  pages: Array<any>;
  VisitTabsPage = 'VisitTabsPage';
  disabled_panic = false;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public codepush: CodePush, public backgroundmode: BackgroundMode, public api: Api, public minimize: AppMinimize, public deeplinks: Deeplinks, public events: Events) {
    this.platform.ready().then(() => {
      this.api.ready.then(() => {
        this.initializeApp();
        console.log(this.api.user);
        if (this.api.user) {
          this.rootPage = 'HomePage';
          this.api.getAllData();
          this.api.getLang();
          this.registerDeepLinks();
        } else {
          this.rootPage = 'Login';
        }
      });
      events.subscribe('login', () => {
        this.registerDeepLinks();
      })
      events.subscribe('logout', () => {
        this.logout();
      })
    });

    // used for an example of ngFor and navigation
    this.pages = [
      // { title: "home", component: 'HomePage', icon: 'home' },
      { title: "profile", component: 'ProfilePage', icon: 'person' },
      { title: "posts", component: 'PostsPage', icon: 'paper' },
      { title: "visitors", component: 'VisitTabsPage', icon: 'contacts', siteHas: 'visits' },
      { title: "lists", component: 'TablesPage', icon: 'list' },
      { title: "surveys", component: 'SurveysPage', icon: 'pie', siteHas: 'surveys' },
      { title: "events", component: 'EventsPage', icon: 'calendar', siteHas: 'events' },
      { title: "invoices", component: 'InvoicesPage', icon: 'card', modules: 'finanze', siteHas: 'invoices' },
      { title: "dynamic_documents", component: 'DocumentsPage', icon: 'document', siteHas: 'documents' },
      { title: "reservations", component: 'ReservationsPage', icon: 'tennisball', modules: 'reservations', beta: true, siteHas: 'reservations' },
      { title: "parkings", component: 'ParkingsPage', icon: 'car', siteHas: 'parkings' },
      { title: "residences", component: 'Residences', icon: 'albums' },
      { title: "chats", component: 'ChatsPage', icon: 'chatbubbles', siteHas: 'chat' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack())
          return this.nav.pop();
        else {
          this.minimize.minimize();
          console.log("minimize");
        }
      });

      this.backgroundmode.enable();
      this.backgroundmode.setDefaults(
        { icon: 'icon', text: "", title: "Residentes Online", color: "#42f459", bigText: true }
      );
      this.backgroundmode.excludeFromTaskList();
      // this.backgroundmode.overrideBackButton();

      var sync = () => {
        this.codepush.sync({ updateDialog: false, ignoreFailedUpdates: false, }).subscribe(
          (status) => {
            console.log(status)
            if (status == 8)
              this.splashScreen.show();
          }
          , (err) => { console.warn(err) });

      }
      sync();
      setTimeout(sync, 1000 * 60 * 60 * 6)
    });
  }

  changeResidence(residence) {
    this.api.user.residence_id = residence.id;
    this.api.storage.set("user", this.api.user);
    this.api.put('users/' + this.api.user.id, { residence_id: residence.id })
      .then((data) => {
        console.log("change residence:", data);
        window.location.reload();
      })
      .catch(console.error)
  }

  openPage(page) {
    // this.nav.setRoot(page.component);
    this.nav.push(page.component);
  }

  backToHome() {
    this.nav.setRoot('HomePage');
  }

  registerDeepLinks() {
    this.deeplinks.route({
      '/visit/:visitId': 'VisitTabsPage',
      '/visitor/:visitorId': 'VisitTabsPage',
      '/surveys': 'SurveyPage',
      '/chat:chatId': 'ChatsPage',
    }).subscribe((match) => {
      console.log('Successfully routed', match);
      var args = {};
      for (var key in match.$args) {
        args[key] = match.$args[key];
      }
      if (match.$link.url.indexOf("residenciasOnline://app/visit") > -1) {
        this.nav.setRoot('VisitTabsPage', args);
        setTimeout(() => {
          this.api.newVisit(args);
        }, 2000)
      }
      if (match.$link.url.indexOf("residenciasOnline://app/visitor") > -1) {
        this.nav.setRoot('VisitTabsPage', args);
      }
      if (match.$link.url.indexOf("residenciasOnline://app/surveys") > -1) {
        this.nav.setRoot('SurveyPage', args);
      }
      if (match.$link.url.indexOf("residenciasOnline://app/chat") > -1) {
        this.nav.push('ChatsPage', args);
      }
    }, (nomatch) => {
      this.nav.setRoot('HomePage');
      console.warn('Unmatched Route', nomatch);
    });
  }

  logout() {
    this.api.storage.clear().then(() => {
      this.nav.setRoot('Login').then(() => {
        this.api.stopEcho();
        this.api.username = ""
        this.api.url = ""
        this.api.user = null;
        this.api.password = ""
        this.api.residence = null;
        this.api.pushUnregister();
        this.api.clearSharedPreferences();
      });
    });
  }

  panic() {
    this.disabled_panic = true;
    this.api.panic()
      .then(() => {
        this.disabled_panic = false;
      })
      .catch(() => {
        this.disabled_panic = false;
      });

  }

  siteHas(modul) {
    if (!this.api.modules) {
      return false;
    }
    else if (modul === undefined || this.api.modules[modul] === undefined) {
      return true
    }
    return this.api.modules[modul];
  }
}
