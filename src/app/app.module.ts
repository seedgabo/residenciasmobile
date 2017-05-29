import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ParkingsPage } from '../pages/parkings/parkings';
import { Login } from "../pages/login/login";
import { Residences } from "../pages/residences/residences";

import { Api } from "../providers/api";
import { TransPipe } from '../pipes/trans/trans';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from '@ionic-native/google-plus';
import { BackgroundMode } from "@ionic-native/background-mode";
import { AppMinimize } from "@ionic-native/app-minimize";
import { CodePush } from '@ionic-native/code-push';
import { NewVisitPage } from "../pages/new-visit/new-visit";
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ParkingsPage,
    Login,
    Residences,
    NewVisitPage,
    TransPipe,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ParkingsPage,
    Login,
    Residences,
    NewVisitPage,
  ],
  providers: [
    StatusBar, SplashScreen, Camera, Facebook, GooglePlus, AppMinimize, BackgroundMode, CodePush,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Api
  ]
})
export class AppModule { }
