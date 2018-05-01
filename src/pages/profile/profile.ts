import { ToastController, ModalController } from "ionic-angular";
import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Api } from "../../providers/api";
import moment from "moment";
import { IonicPage } from "ionic-angular";
import Chart from "chart.js";
@IonicPage()
@Component({
  selector: "page-profile",
  templateUrl: "profile.html"
})
export class ProfilePage {
  toImage: any;
  monthShortNames;
  months;
  profile: any = {};
  residence: any = {};
  editable = false;
  password = "";
  password_confirmation = "";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public toast: ToastController,
    public modal: ModalController
  ) {
    this.monthShortNames = moment.monthsShort().join(", ");
    this.months = moment.months().join(", ");
    this.profile = JSON.parse(JSON.stringify(this.api.user));
    this.profile.birthday = moment(this.api.user.birthday)
      .local()
      .format("YYYY-MM-DD");
    this.residence = JSON.parse(JSON.stringify(this.api.residence));
    if (!this.residence.emergency_contact) {
      this.residence.emergency_contact = {
        name: "",
        phone: "",
        email: ""
      };
    }
  }

  ionViewDidEnter() {
    this.profile = JSON.parse(JSON.stringify(this.api.user));
    this.profile.birthday = moment(this.api.user.birthday)
      .local()
      .format("YYYY-MM-DD");
    this.residence = JSON.parse(JSON.stringify(this.api.residence));
    this.renderChart();
  }
  renderChart() {
    setTimeout(() => {
      var ctx = document.getElementById("chart-debt");
      if (!ctx) return;
      var config = {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [this.residence.total, this.residence.debt],
              backgroundColor: ["#00FF55", "#FF3300"],
              label: this.api.trans("%")
            }
          ],
          labels: [this.api.trans("literals.total"), this.api.trans("literals.debt")]
        },
        options: {
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                return (
                  "$ " +
                  Number(value)
                    .toFixed(0)
                    .replace(/./g, function(c, i, a) {
                      return i > 0 && c !== "," && (a.length - i) % 3 === 0 ? "." + c : c;
                    })
                );
              }
            }
          },
          responsive: true,
          legend: {
            position: "top"
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        }
      };
      new Chart(ctx, config);
    }, 100);
  }

  updateProfile() {
    this.api
      .put(`users/${this.api.user.id}`, {
        name: this.profile.name,
        email: this.profile.email,
        document: this.profile.document,
        sex: this.profile.sex,
        phone_number: this.profile.phone_number,
        birthday: this.profile.birthday,
        relationship: this.profile.relationship
      })
      .then((data: any) => {
        this.api.user.name = data.name;
        this.api.user.email = data.email;
        this.api.user.document = data.document;
        this.api.user.sex = data.sex;
        this.api.user.phone_number = data.phone_number;
        this.api.user.birthday = data.birthday;
        this.api.storage.set("user", this.api.user);
        this.toast
          .create({
            message: this.api.trans("literals.user") + " " + this.api.trans("crud.updated"),
            duration: 1500,
            showCloseButton: true
          })
          .present();
      })
      .catch(console.error);
  }

  updateResidence() {
    this.api
      .put(`residences/${this.api.user.residence_id}?with[]=owner`, {
        name: this.residence.name,
        number_of_people: this.residence.number_of_people,
        owner_id: this.residence.owner_id,
        emergency_contact: this.residence.emergency_contact
      })
      .then((data: any) => {
        this.api.residence.name = data.name;
        this.api.residence.number_of_people = data.number_of_people;
        this.api.residence.owner_id = data.owner_id;
        this.api.residence.owner = data.owner;
        this.api.storage.set("residence", this.api.residence);
        this.toast
          .create({
            message: this.api.trans("literals.residence") + " " + this.api.trans("crud.updated"),
            duration: 1500,
            showCloseButton: true
          })
          .present();
      })
      .catch(console.error);
  }

  updatePassword() {
    this.api
      .post("update-password", { password: this.password })
      .then((data) => {
        this.toast
          .create({
            message: this.api.trans("literals.password") + " " + this.api.trans("crud.updated"),
            duration: 1500
          })
          .present();
      })
      .catch(console.error);
  }

  updatePhoto() {}

  canSaveUser() {
    return (
      this.profile.name &&
      this.profile.name.length > 3 &&
      (this.profile.email && this.profile.email.length > 5) &&
      (this.profile.document && this.profile.document.length > 3)
    );
  }

  canSaveResidence() {
    return this.residence.name && this.residence.name.length > 3 && this.residence.owner_id;
  }

  createUser() {
    var modal = this.modal.create("UserEditorPage");
    modal.present();
    modal.onWillDismiss(() => {
      this.ionViewDidEnter();
    });
  }

  deleteUser(user, index) {
    this.api.alert
      .create({
        title: this.api.trans("__.are you sure"),
        buttons: [
          {
            text: this.api.trans("literals.yes"),
            handler: () => {
              this.api
                .delete("users/" + user.id)
                .then((resp) => {
                  this.api.residence.users.splice(index, 1);
                  this.ionViewDidEnter();
                  this.toast
                    .create({
                      message: this.api.trans("literals.user") + " " + this.api.trans("crud.deleted"),
                      duration: 1500,
                      showCloseButton: true
                    })
                    .present();
                })
                .catch((err) => {
                  this.api.Error(err);
                });
            }
          },
          this.api.trans("crud.cancel")
        ]
      })
      .present();
  }

  askFile(user = null) {
    if (user == null) {
      user = this.api.user;
    }
    this.toImage = user;
    var filer: any = document.querySelector("#input-file");
    filer.click();
  }

  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (result) => {
        this.toImage.image_url = result.target.result;
        this.uploadImage(this.toImage.id);
      };
    } catch (error) {
      console.error(error);
    }
  }

  uploadImage(id) {
    return this.api
      .post("images/upload/user/" + id, { image: this.toImage.image_url })
      .then((data: any) => {
        this.toImage.image = data.image;
        this.toImage.image_url = data.resource.image_url;
        this.toImage.image_id = data.resource.image_id;
        if (this.toImage.id == this.api.user.id) {
          this.api.storage.set("user", this.api.user);
        }
        this.toImage = null;
        this.toast
          .create({
            message: this.api.trans("literals.image") + " " + this.api.trans("crud.updated"),
            duration: 1500,
            showCloseButton: true
          })
          .present();
      })
      .catch((err) => {
        console.error(err);
        this.api.Error(err);
      });
  }
}
