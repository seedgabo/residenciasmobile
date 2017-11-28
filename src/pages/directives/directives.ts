import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';

@IonicPage()
@Component({
  selector: 'page-directives',
  templateUrl: 'directives.html',
})
export class DirectivesPage {
  directives = {}
  tree = null;
  loading = false
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.getDirectives();
  }

  getDirectives() {
    this.loading = true;
    this.api.get("directives?afterQuery[toHierarchy]=null")
      .then((data) => {
        this.directives = data;
        this.tree = this.prepare(data);
        this.loading = false;
        console.log(this.tree);
      })
      .catch((err) => {
        this.loading = false;
        this.api.Error(err);
      })
  }

  prepare(obj) {
    return Object.keys(obj).map((key) => {
      obj[key].isExpanded = true
      return obj[key];
    });
  }
}
