import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Events, Platform } from 'ionic-angular';
import { Api } from "../../providers/api";

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular5-social-login';

declare var window: any;
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {
  forgot = false;
  ready = false;
  servers = { "0000": { "url": "http:\/\/residenciasonline.com\/residencias\/public\/", "name": "El Pe\u00f1on", "url_newton": "http:\/\/residenciasonline.com\/newton\/public" }, "1905": { "url": "http:\/\/residenciasonline.com\/aseinteg\/public\/", "name": "Aseinteg Especial", "url_newton": "http:\/\/residenciasonline.com\/newton\/public" }, "0001": { "url": "http:\/\/residenciasonline.com\/aseinteg\/public\/" }, "7000": { "url": "http:\/\/residenciasonline.com\/penon\/public\/", "name": "El Pe\u00f1on", "url_newton": "" }, "3720": { "url": "http:\/\/residenciasonline.com\/chestnut\/public\/", "name": "Prado Chestnut Hill", "url_newton": "" } };
  code = "";
  preconfigured = false;
  constructor(public platform: Platform, public facebook: Facebook, public google: GooglePlus, public navCtrl: NavController, public navParams: NavParams, public api: Api, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public events: Events, public socialAuthService: AuthService) {
    if (window.url) {
      this.preconfigured = true;
      this.api.storage.set('url', window.url);
    }
  }

  ionViewDidLoad() {
    this.getServers();
  }

  verifyCode() {
    if (this.servers[this.code] !== undefined) {
      var server = this.servers[this.code]
      this.api.url = server.url;
      this.api.storage.set('url', server.url);
    }
  }

  goBack() {
    this.api.url = null;
    this.api.storage.remove('url');
  }

  login() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });

    loading.present();
    this.api.doLogin()
      .then((data: any) => {
        this.api.user = data.user;
        this.api.storage.set('user', data.user).then(() => {
          loading.dismiss();
          this.goTo()
          console.log(data);
        });
      })

      .catch((err) => {
        console.error(err);
        if (err.status === 401) {
          let alert = this.alertCtrl.create({
            title: "Error",
            subTitle: 'Usuario y Contraseña Invalidos',
            buttons: ['OK']
          });
          loading.dismiss();
          alert.present();
        } else {
          let alert = this.alertCtrl.create({
            title: "Error",
            subTitle: 'no se pudo hacer login: ' + err.error,
            buttons: ['OK']
          });
          loading.dismiss();
          alert.present();
        }

      });
  }

  loginWithFacebook() {
    if (this.platform.is('mobile')) {
      return this.loginWithFacebookCordova()
    }


    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });
    loading.present();
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then((userData) => {
        console.log(userData)
        this.OauthSuccessfulLogin(userData, loading)
      })
      .catch(console.error)
  }

  loginWithGoogle() {
    if (this.platform.is('mobile')) {
      return this.loginWithGoogleCordova()
    }
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });
    loading.present();
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((userData) => {
        console.log(userData)
        this.OauthSuccessfulLogin(userData, loading)
      })
      .catch(console.error)
  }


  loginWithFacebookCordova() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });
    loading.present();
    this.facebook.login(['public_profile', 'email'])
      .then((data) => {
        console.log(data);
        this.facebook.api(`${data.authResponse.userID}/?fields=id,email,name,picture,first_name,last_name,gender`, ['public_profile', 'email']).then((data) => {
          console.log(data);
          this.OauthSuccessfulLogin(data, loading)
        }).catch((err) => {
          console.error(err);
          loading.dismiss();
          this.alertCtrl.create({
            message: err,
            title: "Error",
          }).present();

        })
      }).catch((err) => {
        console.error(err);
        loading.dismiss();
        this.alertCtrl.create({
          message: err,
          title: "Error",
        }).present();

      });
  }

  loginWithGoogleCordova() {
    let loading = this.loadingCtrl.create({
      content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });
    loading.present();
    this.google.login({})
      .then((data) => {
        console.log(data);
        loading.dismiss();
      })
      .catch((err) => {
        console.error(err);
        loading.dismiss();
        this.alertCtrl.create({
          message: err,
          title: "Error",
        }).present();
      });
  }


  OauthSuccessfulLogin(data, loading) {
    this.api.loginOAuth(data).then((data) => {
      console.log(data);
      this.api.saveData(data);
      this.goTo();
      if (loading) loading.dismiss();
    }).catch((err) => {
      console.error(err);
      if (loading) loading.dismiss();
      this.alertCtrl.create({
        message: JSON.stringify(err),
        title: "Error",
      }).present();

    });
  }


  recover(email) {
    this.api.post('forgot-password', { email: email })
      .then(() => {
        let alert = this.alertCtrl.create({
          title: "Listo!",
          subTitle: 'Le hemos enviado un correo de recuperación',
          buttons: ['OK']
        });
        alert.present();
      })
      .catch(() => {
        let alert = this.alertCtrl.create({
          title: "Error",
          subTitle: 'No hemos podido validar el usuario asegurese de escribirlo correctamente',
          buttons: ['OK']
        });
        alert.present();
      });
  }

  getServers() {
    this.api.http.get('http://residenciasonline.com/residencias/public/servers.json')
      .map(res => res.json())
      .subscribe((data: any) => {
        this.servers = data
        this.ready = true
        console.log(this.servers);
      }, (err) => {
        console.error(err)
        this.api.Error(err);
      });
  }

  goTo() {
    this.events.publish('login', {});
    this.navCtrl.setRoot('HomePage');
  }

}
