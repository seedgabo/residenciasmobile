import { Api } from './../../providers/api';
import { NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
@Component({
  selector: 'page-pet-editor',
  templateUrl: 'pet-editor.html',
})
export class PetsEditorPage {
  pet: any = {
    name: '',
    document: '',
    work: '',
    sex: '',
    extras: '',
    residence_id: this.api.user.residence_id
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    var pet = navParams.get('pet')
    console.log(pet)
    if (pet !== undefined)
      this.pet = {
        id: pet.id,
        name: pet.name,
        document: pet.document,
        work: pet.work,
        sex: pet.sex,
        extras: pet.extras,
        residence_id: pet.residence_id
      };

  }

  canSave() {
    return this.pet.name.length > 1 &&
      this.pet.document.length > 1 &&
      this.pet.work.length > 1
  }

  save() {
    var promise: Promise<any>;
    if (this.pet.id) {
      promise = this.api.put('pets/' + this.pet.id, this.pet);
    } else {
      promise = this.api.post('pets', this.pet);
    }
    promise.then((data) => {
      this.pet = data;
      this.dismiss();
    })
      .catch(console.error)
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
