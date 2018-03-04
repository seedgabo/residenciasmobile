import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Api } from '../../providers/api';
@IonicPage()
@Component({
  selector: 'page-user-editor',
  templateUrl: 'user-editor.html',
})
export class UserEditorPage {
  user: any = {
    name: '',
    password: '',
    email: '',
    document: '',
    sex: 'male',
    relationship: '',
    residence_id: this.api.user.residence_id,
  }
  loading = false;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public api: Api) {
    if (this.navParams.get('user')) {
      this.user = this.navParams.get('user')
    }
  }

  ionViewDidLoad() {
  }

  canSave() {
    var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return this.user.name.length > 3 &&
      this.user.email.length > 3 &&
      this.user.password.length > 5 &&
      this.user.document.length > 3 &&
      pattern.test(this.user.email)
  }

  save() {
    var user = {
      name: this.user.name,
      password: this.user.password,
      email: this.user.email,
      document: this.user.document,
      sex: this.user.sex,
      relationship: this.user.relationship,
      residence_id: this.api.user.residence_id,
    }
    this.loading = true
    this.api.post('users/create', user)
      .then((response) => {
        this.api.residence.users.push(response);
        this.viewCtrl.dismiss()
        this.loading = false
      })
      .catch((error) => {
        this.loading = false
        this.api.Error(error)
      })
  }

  close() {
    this.viewCtrl.dismiss()
  }
}
