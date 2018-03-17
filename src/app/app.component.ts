import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush } from "@ionic-native/code-push";
import { BackgroundMode } from '@ionic-native/background-mode';
import { Deeplinks } from "@ionic-native/deeplinks";
import { Api } from "../providers/api";
declare var window: any;
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
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public codepush: CodePush, public backgroundmode: BackgroundMode, public api: Api, public deeplinks: Deeplinks, public events: Events) {
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
          this.events.subscribe('login', () => {
            this.api.getAllData();
            this.api.getLang();
            this.registerDeepLinks();
          });
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

    this.pages = [
      // { title: "home", component: 'HomePage', icon: 'home' },
      { title: "invoices", component: 'InvoicesPage', icon: 'card', modules: 'finanze', siteHas: 'invoices' },
      { title: "profile", component: 'ProfilePage', icon: 'person' },
      { title: "correspondences", component: 'CorrespondencesPage', icon: 'cube', siteHas: 'correspondences' },
      { title: "tickets", component: 'TicketsPage', icon: 'filing', modules: 'tickets', siteHas: 'tickets' },
      { title: "dynamic_documents", component: 'DocumentsPage', icon: 'document', siteHas: 'documents' },
      { title: "lists", component: 'TablesPage', icon: 'list' },
      { title: "reservations", component: 'ReservationsPage', icon: 'tennisball', modules: 'reservations', beta: true, siteHas: 'reservations' },
      { title: "visits", component: 'VisitTabsPage', icon: 'contacts', siteHas: 'visits' },
      { title: "posts", component: 'PostsPage', icon: 'paper' },
      { title: "surveys", component: 'SurveysPage', icon: 'pie', siteHas: 'surveys' },
      { title: "events", component: 'EventsPage', icon: 'calendar', modules: 'directives', siteHas: 'events' },
      { title: "directives", component: 'DirectivesPage', icon: 'git-network', siteHas: 'directives' },
      { title: "parkings", component: 'ParkingsPage', icon: 'car', siteHas: 'parkings' },
      { title: "residences", component: 'Residences', icon: 'albums' },
      { title: "chats", component: 'ChatsPage', icon: 'chatbubbles', siteHas: 'chat' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack())
          return this.nav.pop();
        else {
          this.backgroundmode.moveToBackground();
        }
      });

      this.backgroundmode.enable();
      this.backgroundmode.setDefaults(
        { icon: 'icon', text: "", title: "Residentes Online", color: "#42f459", bigText: true }
      );
      this.backgroundmode.excludeFromTaskList();
      this.backgroundmode.disableWebViewOptimizations();
      // this.backgroundmode.overrideBackButton();

      var sync = () => {
        this.codepush.sync({ updateDialog: false, ignoreFailedUpdates: false, }).subscribe(
          (status) => {
            console.log(status)
            if (status == 8)
              this.splashScreen.show();
          }
          , (err) => {
            console.warn(err)
            this.splashScreen.hide();
          });

      }
      sync();
      setTimeout(sync, 1000 *10)
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
      .catch(this.api.Error)
  }

  openPage(page) {
    if (this.platform.is('mobile')) {
      this.nav.push(page.component);

    } else {
      this.nav.setRoot(page.component);
    }
  }

  backToHome() {
    this.nav.setRoot('HomePage');
  }

  registerDeepLinks() {
    this.deeplinks.route({
      '/visit/:visitId': 'VisitTabsPage',
      '/visitor/:visitorId': 'VisitTabsPage',
      '/surveys': 'SurveyPage',
      '/chat/:chatId': 'ChatsPage',
      '/post/:postId': 'PostPage',
      '/correspondences:correspondenceId': 'CorrespondencesPage',
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
      if (match.$link.url.indexOf("residenciasOnline://app/correspondences") > -1) {
        this.nav.setRoot('CorrespondencesPage', args);
      }
      if (match.$link.url.indexOf("residenciasOnline://app/surveys") > -1) {
        this.nav.setRoot('SurveyPage', args);
      }
      if (match.$link.url.indexOf("residenciasOnline://app/chat") > -1) {
        this.nav.push('ChatsPage', args);
      }
    }, (nomatch) => {
      // console.warn('Unmatched Route', nomatch);
      if (nomatch && nomatch.$link) {
        if (nomatch.$link.url && nomatch.$link.url.indexOf("sos") > -1) {
          this.api.ready.then(() => {
            setTimeout(() => {
              this.api.panic().then(() => { }).catch((err) => { this.api.Error(err) });
            }, 1200);
          })
        }
      }
    });
  }

  logout() {
    this.api.storage.clear().then(() => {
      this.nav.setRoot('Login').then(() => {
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
