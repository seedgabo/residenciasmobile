import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { MomentModule } from 'angular2-moment';

import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { Api } from "../providers/api";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { Vibration } from '@ionic-native/vibration';
import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from '@ionic-native/google-plus';
import { BackgroundMode } from "@ionic-native/background-mode";
import { AppMinimize } from "@ionic-native/app-minimize";
import { CodePush } from '@ionic-native/code-push';
import { OneSignal } from "@ionic-native/onesignal";
import { Device } from "@ionic-native/device";
import { File } from '@ionic-native/file';
import { FileOpener } from "@ionic-native/file-opener";
import { Transfer } from "@ionic-native/transfer";
import { Deeplinks } from "@ionic-native/deeplinks";
import { AutoCompleteModule } from 'ionic2-auto-complete';
import { DatePickerModule } from 'datepicker-ionic2';
import { PipesModule } from '../pipes/pipes.module';




@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AutoCompleteModule,
    MomentModule,
    DatePickerModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar, SplashScreen, Camera, Facebook, GooglePlus, AppMinimize, BackgroundMode, CodePush, OneSignal, Device,
    Deeplinks, Transfer, File, FileOpener, Vibration,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Api,
  ]
})
export class AppModule { }
