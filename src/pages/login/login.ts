import {
  trigger,
  style,
  transition,
  animate,
  query,
  stagger
} from "@angular/animations";

import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  Events,
  Platform
} from "ionic-angular";
import { Api } from "../../providers/api";

import { Facebook } from "@ionic-native/facebook";
import { GooglePlus } from "@ionic-native/google-plus";

import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from "angular5-social-login";
import { Component } from "@angular/core";

declare var window: any;
@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
  animations: [
    trigger("item", [
      transition(":enter", [
        query(
          ":self",
          stagger(120, [
            style({ opacity: 0, transform: "translateX(-200px)" }),
            animate("800ms ease-in-out")
          ])
        )
      ])
    ]),
    trigger("list", [
      transition(":enter", [
        query(
          ".item",
          stagger(120, [
            style({ opacity: 0, transform: "translateX(-200px)" }),
            animate("800ms ease-in-out")
          ])
        )
      ])
    ])
  ]
})
export class Login {
  forgot = false;
  ready = false;
  logins = [];
  preconfigured = false;
  select = false;
  smarter = false;
  oauthInfo;
  constructor(
    public platform: Platform,
    public facebook: Facebook,
    public google: GooglePlus,
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public events: Events,
    public socialAuthService: AuthService
  ) {
    if (window.url) {
      this.api.url = window.url;
      this.preconfigured = true;
      this.api.storage.set("url", window.url);
    }
  }

  ionViewDidLoad() {}

  goBack() {
    this.api.url = null;
    this.api.storage.remove("url");
    this.api.username = "";
    this.smarter = false;
    this.logins = [];
    this.oauthInfo = null;
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
      </div>`,
      spinner: "hide"
    });

    loading.present();
    this.api
      .doLogin()
      .then((data: any) => {
        this.api.user = data.user;
        this.api.storage.set("user", data.user).then(() => {
          loading.dismiss();
          this.goTo();
          console.log(data);
        });
      })

      .catch(err => {
        console.error(err);
        if (err.status === 401) {
          let alert = this.alertCtrl.create({
            title: "Error",
            subTitle: "Usuario y Contraseña Invalidos",
            buttons: ["OK"]
          });
          loading.dismiss();
          alert.present();
        } else {
          let alert = this.alertCtrl.create({
            title: "Error",
            subTitle: "no se pudo hacer login: " + err.error,
            buttons: ["OK"]
          });
          loading.dismiss();
          alert.present();
        }
      });
  }

  loginWithFacebook(smarter = true) {
    if (this.platform.is("mobile")) {
      return this.loginWithFacebookCordova();
    }

    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
      </div>`,
      spinner: "hide"
    });
    loading.present();
    this.socialAuthService
      .signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(userData => {
        console.log(userData);
        if (smarter) {
          this.OauthSuccessfulSmartLogin(userData, loading);
        } else {
          this.OauthSuccessfulLogin(userData, loading);
        }
      })
      .catch(console.error);
  }

  loginWithGoogle(smarter = true) {
    if (this.platform.is("mobile")) {
      return this.loginWithGoogleCordova();
    }
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
      </div>`,
      spinner: "hide"
    });
    loading.present();
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(userData => {
        console.log(userData);
        if (smarter) {
          this.OauthSuccessfulSmartLogin(userData, loading);
        } else {
          this.OauthSuccessfulLogin(userData, loading);
        }
      })
      .catch(err => {
        loading.dismiss();
        this.api.Error(err);
      });
  }

  loginWithFacebookCordova() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
      </div>`,
      spinner: "hide"
    });
    loading.present();
    this.facebook
      .login(["public_profile", "email"])
      .then(data => {
        console.log(data);
        this.facebook
          .api(
            `${
              data.authResponse.userID
            }/?fields=id,email,name,picture,first_name,last_name,gender`,
            ["public_profile", "email"]
          )
          .then(data => {
            console.log(data);
            this.OauthSuccessfulLogin(data, loading);
          })
          .catch(err => {
            console.error(err);
            loading.dismiss();
            this.alertCtrl
              .create({
                message: err,
                title: "Error"
              })
              .present();
          });
      })
      .catch(err => {
        console.error(err);
        loading.dismiss();
        this.alertCtrl
          .create({
            message: err,
            title: "Error"
          })
          .present();
      });
  }

  loginWithGoogleCordova() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
      </div>`,
      spinner: "hide"
    });
    loading.present();
    this.google
      .login({})
      .then(data => {
        console.log(data);
        loading.dismiss();
      })
      .catch(err => {
        console.error(err);
        loading.dismiss();
        this.alertCtrl
          .create({
            message: err,
            title: "Error"
          })
          .present();
      });
  }

  OauthSuccessfulLogin(data, loading = null) {
    this.api
      .loginOAuth(data)
      .then(data => {
        console.log(data);
        this.api.saveData(data);
        this.goTo();
        if (loading) loading.dismiss();
      })
      .catch(err => {
        console.error(err);
        if (loading) loading.dismiss();
        this.alertCtrl
          .create({
            message: JSON.stringify(err),
            title: "Error"
          })
          .present();
      });
  }

  OauthSuccessfulSmartLogin(data, loading) {
    this.smarter = true;
    this.oauthInfo = data;
    debugger;
    this.api.username = data.email;
    this.getLogins(loading);
  }

  recover(email) {
    this.api
      .post("forgot-password", { email: email })
      .then(() => {
        let alert = this.alertCtrl.create({
          title: "Listo!",
          subTitle: "Le hemos enviado un correo de recuperación",
          buttons: ["OK"]
        });
        alert.present();
      })
      .catch(() => {
        let alert = this.alertCtrl.create({
          title: "Error",
          subTitle:
            "No hemos podido validar el usuario asegurese de escribirlo correctamente",
          buttons: ["OK"]
        });
        alert.present();
      });
  }

  getLogins(loading = null) {
    if (!this.api.username || this.api.username.length == 0) {
      return;
    }
    if (!loading) {
      loading = this.loadingCtrl.create({
        content: `
        <div>
          <img class="loading-img" src="http://residenciasonline.com/residencias/public/img/logo.png"}" alt="">
        </div>`,
        spinner: "hide"
      });
      loading.present();
    }

    this.api.http
      .get(
        "http://residenciasonline.com/residencias/public/api/smart-login?email=" +
          this.api.username
      )
      .map(res => res.json())
      .subscribe(
        (data: any) => {
          if (data.length == 0) {
            loading.dismiss().then(() => {
              this.alertCtrl
                .create({
                  title: this.api.trans("__.No hay usuario registrado"),
                  buttons: ["OK"]
                })
                .present();
            });
            return;
          }
          if (data.length == 1) {
            this.selectServer(data[0]);
            loading.dismiss();
            return;
          }
          this.logins = data;
          this.select = true;
          loading.dismiss();
        },
        err => {
          console.error(err);
          this.api.Error(err);
          loading.dismiss();
        }
      );
  }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.getLogins();
    }
  }

  selectServer(srv) {
    this.api.url = srv.url;
    this.api.storage.set("url", srv.url);
    this.select = false;
    if (this.smarter) {
      this.OauthSuccessfulLogin(this.oauthInfo);
    }
  }

  goTo() {
    this.events.publish("login", {});
    this.navCtrl.setRoot("HomePage");
  }
}
