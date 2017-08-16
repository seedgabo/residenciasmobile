import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Api } from "../../providers/api";
import { Transfer, TransferObject } from "@ionic-native/transfer";
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
})
export class DocumentsPage {
  documents = [];
  selected = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public sanitizer: DomSanitizer, public file: File, public transfer: Transfer, public fileOpener: FileOpener) {
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
    var transfer: TransferObject = this.transfer.create();
    var url = this.api.url + "api/document/" + document.id;
    transfer.download(url, this.file.dataDirectory + 'document.pdf', true, {
      headers: {
        "Auth-Token": this.api.user.token
      }
    })
      .then((entry) => {
        console.log(entry)
        this._openFile(entry.toURL(), document.type)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  _openFile(url, type = "pdf") {
    if (type === 'pdf' || type === 'dynamic') {
      var mime = 'application/pdf'
    }
    else if (type === 'jpg') {
      var mime = 'image/jpeg'
    }
    else if (type === 'png') {
      var mime = 'image/png'
    }
    else if (type === 'xls' || type === 'xlsx') {
      var mime = 'application/vnd.ms-excel';
    }
    else {
      var mime = "";
    }
    this.fileOpener.open(url, mime)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));
  }

  iconColor(document) {
    var type = document.type
    if (type === 'pdf' || type === 'dynamic') {
      return 'danger'
    }
    else if (type === 'jpg') {
      return 'primary'
    }
    else if (type === 'png') {
      return 'primary'
    }
    else if (type === 'xls' || type === 'xlsx') {
      return 'secondary';
    }
    else {
      return "dark";
    }
  }
}
