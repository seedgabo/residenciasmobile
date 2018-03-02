import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Api } from "../../providers/api";
import { Transfer, TransferObject } from "@ionic-native/transfer";
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";
import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-documents',
  templateUrl: 'documents.html',
})
export class DocumentsPage {
  documents = [];
  selected = null;
  query = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public file: File, public transfer: Transfer, public fileOpener: FileOpener, public platform: Platform) {
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
    if (this.platform.is('android')) {
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
    } else {
      return this.downloadBrowser(document)
    }
  }

  downloadBrowser(document) {
    var url = this.api.url + "api/document/" + document.id + "?token=" + this.api.user.token;
    window.open(url, "document");
  }

  documentsFilter() {
    if (this.query === '') {
      return this.documents;
    }
    return this.documents.filter((doc) => {
      return (doc.title && doc.title.toLowerCase().indexOf(this.query.toLowerCase()) > -1)
        || (doc.description && doc.description.toLowerCase().indexOf(this.query.toLowerCase()) > -1)
        || (doc.type && doc.type.toLowerCase().indexOf(this.query.toLowerCase()) > -1);
    })
  }

  _openFile(url, type = "pdf") {
    var mime;
    if (type === 'pdf' || type === 'dynamic') {
      mime = 'application/pdf'
    }
    else if (type === 'jpg') {
      mime = 'image/jpeg'
    }
    else if (type === 'png') {
      mime = 'image/png'
    }
    else if (type === 'xls' || type === 'xlsx') {
      mime = 'application/vnd.ms-excel';
    }
    else if (type === 'doc' || type === 'docx') {
      mime = 'application/msword';
    }
    else if (type === 'ppt' || type === 'pptx') {
      mime = 'vnd.ms-powerpoint';
    }
    else {
      mime = "";
    }
    this.fileOpener.open(url, mime)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));
  }

  iconColor(document) {
    var type = document.type
    if (type === 'pdf' || type === 'dynamic') {
      return '#F44336'
    }
    else if (type === 'jpg') {
      return '#00BCD4'
    }
    else if (type === 'png') {
      return '#00BCD4'
    }
    else if (type === 'xls' || type === 'xlsx') {
      return '#4CAF50';
    }
    else {
      return "#2196F3";
    }
  }

  icon(document) {
    var type = document.type
    if (type === 'pdf' || type === 'dynamic') {
      return 'fa-file-pdf-o'
    }
    else if (type === 'jpg') {
      return 'fa-file-image-o'
    }
    else if (type === 'png') {
      return 'fa-file-image-o'
    }
    else if (type === 'xls' || type === 'xlsx') {
      return 'fa-file-excel-o';
    }
    else {
      return "fa-file-o";
    }
  }
}
