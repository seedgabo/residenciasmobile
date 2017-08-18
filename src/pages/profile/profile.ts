import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import moment from 'moment';
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  monthShortNames;
  months;
  profile: any = {};
  residence: any = {};
  editable = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.monthShortNames = moment.monthsShort().join(", ");
    this.months = moment.months().join(", ");
    this.profile = JSON.parse(JSON.stringify(this.api.user));
    this.profile.birthday = moment(this.api.user.birthday).format('YYYY-MM-DD');
    this.residence = JSON.parse(JSON.stringify(this.api.residence));
  }

  ionViewDidLoad() {

  }

  updateProfile() {
    this.api.put(`users/${this.api.user.id}`, {
      name: this.profile.name,
      email: this.profile.email,
      document: this.profile.document,
      sex: this.profile.sex,
      phone_number: this.profile.phone_number,
      birthday: this.profile.birthday
    })
      .then((data: any) => {
        this.api.user.name = data.name;
        this.api.user.email = data.email;
        this.api.user.document = data.document;
        this.api.user.sex = data.sex;
        this.api.user.phone_number = data.phone_number;
        this.api.user.birthday = data.birthday;
        this.api.storage.set('user', this.api.user);

      })
      .catch(console.error)
  }

  updateResidence() {
    this.api.put(`residences/${this.api.user.residence_id}?with[]=owner`, {
      name: this.residence.name,
      number_of_people: this.residence.number_of_people,
      owner_id: this.residence.owner_id
    })
      .then((data: any) => {
        this.api.residence.name = data.name;
        this.api.residence.number_of_people = data.number_of_people;
        this.api.residence.owner_id = data.owner_id;
        this.api.residence.owner = data.owner;
        this.api.storage.set('residence', this.api.residence);
      })
      .catch(console.error)
  }

  updatePhoto() {
  }

  canSaveUser() {
    return (this.profile.name && this.profile.name.length > 3) &&
      (this.profile.email && this.profile.email.length > 5) &&
      (this.profile.document && this.profile.document.length > 3)
  }
  canSaveResidence() {
    return (this.residence.name && this.residence.name.length > 3) &&
      (this.residence.owner_id)
  }

}
