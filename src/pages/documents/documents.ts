import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Api } from "../../providers/api";
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
})
export class DocumentsPage {
  documents = [];
  selected = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public sanitizer: DomSanitizer) {
  }

  ionViewDidLoad() {
    this.getDocuments();
  }
  getDocuments() {
    this.api.get('documents')
      .then((data: any) => {
        console.log(data);
        this.documents = data;
      })
      .catch((err) => {
        console.error(err);
      });
  }
  download(document) {
    console.log(document);
    this.selected = document;
  }
}
