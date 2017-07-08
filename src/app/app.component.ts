import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush } from "@ionic-native/code-push";
import { BackgroundMode } from '@ionic-native/background-mode';
import { Deeplinks } from "@ionic-native/deeplinks";

import { HomePage } from '../pages/home/home';
import { ParkingsPage } from '../pages/parkings/parkings';
import { Login } from '../pages/login/login';
import { Residences } from "../pages/residences/residences";
import { Api } from "../providers/api";
import { AppMinimize } from "@ionic-native/app-minimize";
import { VisitTabsPage } from "../pages/visit-tabs/visit-tabs";
import { EventsPage } from "../pages/events/events";
import { InvoicesPage } from "../pages/invoices/invoices";
import { DocumentsPage } from "../pages/documents/documents";
import { PostsPage } from "../pages/posts/posts";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<any>;
  VisitTabsPage = VisitTabsPage;
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public codepush: CodePush, public backgroundmode: BackgroundMode, public api: Api, public minimize: AppMinimize, public deeplinks: Deeplinks, public events: Events) {
    this.initializeApp();
    this.platform.ready().then(() => {
      this.api.ready.then(() => {
        console.log(this.api.user);
        if (this.api.user) {
          this.rootPage = HomePage;
          this.api.getAllData();
          this.registerDeepLinks();
        } else {
          this.rootPage = Login;
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
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: "Visitantes", component: VisitTabsPage, icon: 'contacts' },
      { title: "Noticias", component: PostsPage, icon: 'paper' },
      { title: "Eventos", component: EventsPage, icon: 'calendar' },
      { title: "Facturas", component: InvoicesPage, icon: 'card' },
      { title: "Documentos", component: DocumentsPage, icon: 'document' },
      { title: 'Parkings', component: ParkingsPage, icon: 'car' },
      { title: "Residencias", component: Residences, icon: 'albums' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack())
          return this.nav.pop();
        this.minimize.minimize();
        console.log("minimize");
      });

      this.backgroundmode.enable();
      this.backgroundmode.configure({ silent: true, text: "Residencias", hidden: true, title: "Residencias Online" });
      this.backgroundmode.setDefaults(
        { silent: true, text: "Residencias", hidden: true, title: "Residencias Online" }
      );
      // this.backgroundmode.excludeFromTaskList();
      // this.backgroundmode.overrideBackButton();
      this.codepush.sync({ updateDialog: false, ignoreFailedUpdates: false, }).subscribe((syncStatus) => console.log(syncStatus), (err) => { console.warn(err) });
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  registerDeepLinks() {
    this.deeplinks.route({
      '/visit/:visitId': VisitTabsPage,
      '/visitor/:visitorId': VisitTabsPage,
    }).subscribe((match) => {
      console.log('Successfully routed', match);
      var args = {};
      for (var key in match.$args) {
        args[key] = match.$args[key];
      }
      if (match.$link.url.indexOf("residenciasOnline://app/visit")) {
        this.nav.setRoot(VisitTabsPage, args);
      }
      if (match.$link.url.indexOf("residenciasOnline://app/visitor")) {
        this.nav.setRoot(VisitTabsPage, args);
      }
    }, (nomatch) => {
      this.nav.setRoot(HomePage);
      console.warn('Unmatched Route', nomatch);
    });
  }

  logout() {
    this.api.stopEcho();
    this.api.storage.clear().then(() => {
      this.nav.setRoot(Login);
    });
  }
}
