import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

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
import { Geolocation } from '@ionic-native/geolocation';

import { Device } from "@ionic-native/device";
import { File } from '@ionic-native/file';
import { FileOpener } from "@ionic-native/file-opener";
import { FileTransfer } from "@ionic-native/file-transfer";
import { Deeplinks } from "@ionic-native/deeplinks";
import { PipesModule } from '../pipes/pipes.module';

import { DatePickerModule } from 'datepicker-ionic2';
import { PopoverMenu } from '../pages/popover/popover-menu';


@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    DatePickerModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar, SplashScreen, Camera, Facebook, GooglePlus, AppMinimize, BackgroundMode, CodePush, OneSignal, Device,
    Deeplinks, FileTransfer, File, FileOpener, Vibration, Geolocation,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Api, PopoverMenu,

  ]
})
export class AppModule { }
