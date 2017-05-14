import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Api } from "../../providers/api";
import { HomePage } from "../home/home";
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class Login {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  login() {
    let loading = this.loadingCtrl.create({
       content: `
      <div>
        <img class="loading-img" src="${this.api.url + "img/logo-completo.png"}" alt="">
        <h3>Cargando ...</h3>
      </div>`,
      spinner: 'hide',
    });

    loading.present();
   this.api.doLogin()
      .then((data) => {
        this.api.user = data;
        loading.dismiss();
        this.goTo()
        console.log(data);
        

      })

      .catch((err) => {
        console.error(err);
        let alert = this.alertCtrl.create({
          title: "Error",
          subTitle: 'Usuario y Contraseña Invalidos',
          buttons: ['OK']
        });
        loading.dismiss();
        alert.present();

      });
  }


  goTo() {
    this.navCtrl.setRoot(HomePage);

  }

}
