import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpModule } from "@angular/http";
import { IonicStorageModule } from "@ionic/storage";

import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { MyApp } from "./app.component";

import { Api } from "../providers/api";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { Camera } from "@ionic-native/camera";
import { Vibration } from "@ionic-native/vibration";
import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from "@ionic-native/google-plus";
import { BackgroundMode } from "@ionic-native/background-mode";
import { AppMinimize } from "@ionic-native/app-minimize";
import { CodePush } from "@ionic-native/code-push";
import { OneSignal } from "@ionic-native/onesignal";
import { Geolocation } from "@ionic-native/geolocation";

import { Device } from "@ionic-native/device";
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
import { FileTransfer } from "@ionic-native/file-transfer";
import { Deeplinks } from "@ionic-native/deeplinks";
import { PipesModule } from "../pipes/pipes.module";

import { DatePickerModule } from "datepicker-ionic2";
import { PopoverMenu } from "../pages/popover/popover-menu";

import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from "angular5-social-login";
import { ComponentsModule } from "../components/components.module";
// Configs
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig([
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider("796212907168839")
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        "425679220353-u39prig4hkrjg592lnppmnbfj6lvi4qk.apps.googleusercontent.com"
      )
    }
  ]);
  return config;
}

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    DatePickerModule,
    SocialLoginModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Facebook,
    GooglePlus,
    AppMinimize,
    BackgroundMode,
    CodePush,
    OneSignal,
    Device,
    Deeplinks,
    FileTransfer,
    File,
    FileOpener,
    Vibration,
    Geolocation,
    Api,
    PopoverMenu,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: AuthServiceConfig, useFactory: getAuthServiceConfigs }
  ]
})
export class AppModule {}
