import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { Api } from "../../providers/api";
import { Transfer, TransferObject } from "@ionic-native/transfer";
import { File } from '@ionic-native/file';
import { FileOpener } from "@ionic-native/file-opener";
@Component({
  selector: 'page-invoices',
  templateUrl: 'invoices.html',
})
export class InvoicesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public transfer: Transfer, public file: File, public fileOpener: FileOpener, public actionsheet: ActionSheetController) {
  }

  ionViewDidLoad() {
    this.getInvoices();
  }

  getInvoices(refresher = null) {
    this.api.get(`invoices?order[date]=desc&where[residence_id]=${this.api.user.residence_id}&with[]=user&with[]=receipts&take=12`)
      .then((data: any) => {
        console.log(data);
        this.api.invoices = data;
        if (refresher != null)
          refresher.complete();
      })
      .catch((err) => {
        console.error(err);
        if (refresher != null)
          refresher.complete();

      });
  }

  downloadinvoice(invoice) {
    var transfer: TransferObject = this.transfer.create();
    var url = this.api.url + "api/invoice/" + invoice.id + "/pdf";
    transfer.download(url, this.file.dataDirectory + 'invoice.pdf', true, {
      headers: {
        "Auth-Token": this.api.user.token
      }
    })
      .then((entry) => {
        console.log(entry)
        this._openFile(entry.toURL())
      })
      .catch((err) => {
        console.error(err)
      })
  }

  downloadReceipt(invoice) {
    if (invoice.receipts.length == 0) {
      return
    }
    var receipt = invoice.receipts[invoice.receipts.length - 1];
    var transfer: TransferObject = this.transfer.create();
    var url = this.api.url + "api/receipt/" + receipt.id + "/pdf";
    transfer.download(url, this.file.dataDirectory + 'receipt.pdf', true, {
      headers: {
        "Auth-Token": this.api.user.token
      }
    })
      .then((entry) => {
        console.log(entry)
        this._openFile(entry.toURL())
      })
      .catch((err) => {
        console.error(err)
      })
  }

  _openFile(url, type = "pdf") {
    this.fileOpener.open(url, 'application/pdf')
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));
  }

  openMenu(invoice) {
    var buttons = [
      {
        text: this.api.trans("literals.download") + " " + this.api.trans('literals.invoice'),
        icon: "document",
        cssClass: 'danger',
        handler: () => {
          this.downloadinvoice(invoice);
        }
      },
      {
        text: this.api.trans("__.report payment"),
        icon: "cash",
        cssClass: 'primary',
        handler: () => {
        }
      },
      {
        text: this.api.trans("literals.view_resource") + " " + this.api.trans('literals.details'),
        icon: "ios-list-box",
        cssClass: '',
        handler: () => {
        }
      }
    ];
    if (invoice.receipts.length > 0) {
      buttons.push({
        text: this.api.trans("literals.download") + " " + this.api.trans('literals.receipt'),
        icon: "filing",
        cssClass: "secondary",
        handler: () => {
          this.downloadReceipt(invoice);
        }
      });
    }

    var sheet = this.actionsheet.create({
      title: this.api.trans("literals.invoice") + "  " + invoice.number,
      buttons: buttons
    });

    sheet.present();
  }

}
