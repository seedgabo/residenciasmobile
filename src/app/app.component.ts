import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CodePush } from "@ionic-native/code-push";
import { BackgroundMode } from '@ionic-native/background-mode';

import { HomePage } from '../pages/home/home';
import { ParkingsPage } from '../pages/parkings/parkings';
import { Login } from '../pages/login/login';
import { Residences } from "../pages/residences/residences";
import { Api } from "../providers/api";
import { AppMinimize } from "@ionic-native/app-minimize";
import { VisitTabsPage } from "../pages/visit-tabs/visit-tabs";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<any>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public codepush: CodePush, public backgroundmode: BackgroundMode, public api: Api, public minimize: AppMinimize) {
    this.initializeApp();
    this.platform.ready().then(() => {
      this.api.ready.then(() => {
        console.log(this.api.user);
        if (this.api.user) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = Login;
        }

      });
    });

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: "Visitantes", component: VisitTabsPage, icon: 'contacts' },
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

      // this.backgroundmode.configure({ hidden: true, silent: true, });
      this.backgroundmode.setDefaults({
        title: 'Residencias Online',
        text: "",
        bigText: true,
      })
      this.backgroundmode.enable();
      this.backgroundmode.configure({ text: "", title: "Residencias Online" });
      this.backgroundmode.excludeFromTaskList();
      // this.backgroundmode.overrideBackButton();
      this.codepush.sync().subscribe((syncStatus) => console.log(syncStatus), (err) => { console.warn(err) });
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.api.stopEcho();
    this.api.storage.clear().then(() => {
      this.nav.setRoot(Login);
    });
  }
}
