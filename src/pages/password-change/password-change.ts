import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController, ViewController } from "ionic-angular";
import { Api } from "../../providers/api";
@IonicPage()
@Component({
  selector: "page-password-change",
  templateUrl: "password-change.html"
})
export class PasswordChangePage {
  password = "";
  password_confirmation = "";
  loading = false;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public api: Api,
    public toast: ToastController
  ) {}

  ionViewDidLoad() {}

  dismiss() {
    this.viewCtrl.dismiss();
  }

  updatePassword() {
    this.loading = true;
    this.api
      .post("update-password", { password: this.password })
      .then((data) => {
        this.toast
          .create({
            message: this.api.trans("literals.password") + " " + this.api.trans("crud.updated"),
            duration: 1500
          })
          .present();
        this.loading = false;
        this.viewCtrl.dismiss();
      })
      .catch((error) => {
        this.loading = false;
        this.api.Error(error);
      });
  }

  canSave() {
    return this.password == this.password_confirmation && this.password.length > 5;
  }
}
