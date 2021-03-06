import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { Api } from "../../providers/api";

@IonicPage()
@Component({
  selector: 'page-new-visitor',
  templateUrl: 'new-visitor.html',
})
export class NewVisitorPage {

  action: string = 'create';
  visitor: any = { sex: 'male' };
  loading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public viewCtrl: ViewController) {
    var visitor = navParams.get('visitor');
    if (visitor) {
      this.visitor = visitor;
      this.action = 'update';
    }
    this.visitor.residence_id = this.api.residence.id;

  }

  ionViewDidLoad() {
  }

  dismiss() {
    if (this.action == 'update')
      this.visitor = this.navParams.get('visitor');
    this.viewCtrl.dismiss();
  }

  canSave() {
    return this.visitor.name && this.visitor.name.length > 3 && this.visitor.document && this.visitor.residence_id;
  }
  save() {
    var data = {
      name: this.visitor.name,
      document: this.visitor.document,
      residence_id: this.visitor.residence_id,
      sex: this.visitor.sex,
      relationship: this.visitor.relationship
    };
    if (this.action == 'create') {
      this.loading = true;
      this.api.post('visitors', data).then((response) => {
        console.log(response);
        this.viewCtrl.dismiss();
        this.loading = false;
      }).catch((err) => {
        console.log(err);
        this.loading = false;
        this.api.Error(err);
      });
    }
    if (this.action == 'update') {
      this.loading = true;
      this.api.put('visitors/' + this.visitor.id, data).then((response) => {
        console.log(response);
        this.viewCtrl.dismiss();
        this.loading = false;
      }).catch((err) => {
        console.log(err);
        this.loading = false;
        this.api.Error(err);
      });
    }

  }

}
