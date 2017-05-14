import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ParkingsPage } from '../pages/parkings/parkings';
import { Login } from '../pages/login/login';
import { Residences } from "../pages/residences/residences";
import { Api } from "../providers/api";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<any>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public api: Api) {
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
      { title: 'Home', component: HomePage },
      { title: 'Parkings', component: ParkingsPage },
      { title: "Residencias", component: Residences }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.api.storage.clear().then(() => {
      this.nav.setRoot(Login);
    });
  }
}
