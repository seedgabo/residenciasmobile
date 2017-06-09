import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from "../../providers/api";
// import { Camera, CameraOptions } from '@ionic-native/camera';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  nombre = "gabriel";
  sliders = [];
  text = "";

  constructor(public navCtrl: NavController, public api: Api) {
    this.getSliders();
    this.api.getAllData();
  }

  ionViewDidLoad() {
    this.api.startEcho();
  }

  getSliders() {
    this.api.get("sliders?with[]=image")
      .then((data: any) => {
        console.log(data);
        this.sliders = data;
      })
      .catch((error) => {
        console.error("error trayendo los sliders:", error);
      });

  }


}

