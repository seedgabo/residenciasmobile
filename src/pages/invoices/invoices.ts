import { Component } from "@angular/core";
import { NavController, NavParams, ActionSheetController, PopoverController, Platform } from "ionic-angular";
import { Api } from "../../providers/api";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { FileOpener } from "@ionic-native/file-opener";

import { IonicPage } from "ionic-angular";
import moment from "moment";
import { PopoverMenu } from "../popover/popover-menu";
moment.locale("es");
@IonicPage()
@Component({
  selector: "page-invoices",
  templateUrl: "invoices.html"
})
export class InvoicesPage {
  types = "all";
  toShow = [];
  view = "grid";
  loading = true;
  mobile = false;
  rows = [];
  columns = [
    { prop: "number", name: "#" },
    { prop: "date", name: this.api.trans("literals.date") },
    { prop: "type", name: this.api.trans("literals.type") },
    { prop: "status", name: this.api.trans("literals.status") },
    { prop: "total", name: this.api.trans("literals.total") }
  ];
  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    public api: Api,
    public transfer: FileTransfer,
    public file: File,
    public fileOpener: FileOpener,
    public actionsheet: ActionSheetController,
    public popover: PopoverController,
    public popovermenu: PopoverMenu
  ) {
    this.mobile = this.platform.is("android") || this.platform.is("ios");
  }

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.getInvoices();
    });
  }

  getInvoices(refresher = null) {
    this.api
      .get(
        `invoices?order[date]=desc&orWhere[residence_id]=${this.api.user.residence_id}&orWhere[user_id]=${
          this.api.user.id
        }&with[]=user&with[]=receipts&with[]=items&take=500`
      )
      .then((data: any) => {
        console.log(data);
        this.api.objects.invoices = data;
        this.filter();
        this.loading = false;
        if (refresher != null) refresher.complete();
      })
      .catch((err) => {
        console.error(err);
        if (refresher != null) refresher.complete();
        this.loading = false;
      });
  }

  filter() {
    if (this.types === "all") {
      this.toShow = this.api.objects.invoices;
      return this.getRows();
    }
    this.toShow = this.api.objects.invoices.filter((inv) => {
      return inv.type == this.types;
    });
    this.getRows();
  }

  getRows() {
    var arr = [];
    this.toShow.forEach((inv) => {
      arr.push({
        invoice: inv,
        id: inv.id,
        number: inv.number,
        total: inv.total,
        type: this.api.trans("literals." + inv.type),
        status: inv.status,
        date: moment(inv.date)
      });
    });
    this.rows = arr;
  }

  changeView() {
    this.view = this.view === "grid" ? "list" : "grid";
  }

  downloadinvoice(invoice) {
    if (this.platform.is("android") || this.platform.is("ios")) {
      var transfer: FileTransferObject = this.transfer.create();
      var url = this.api.url + "api/invoice/" + invoice.id + "/pdf?pdf=1";
      transfer
        .download(url, this.file.dataDirectory + "invoice.pdf", true, {
          headers: {
            "Auth-Token": this.api.user.token
          }
        })
        .then((entry) => {
          console.log(entry);
          this._openFile(entry.toURL());
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      return this.downloadInvoiceBrowser(invoice);
    }
  }

  downloadInvoiceBrowser(invoice) {
    var url = this.api.url + "api/invoice/" + invoice.id + "/pdf?pdf=1&token=" + this.api.user.token;
    window.open(url, "invoice");
  }
  downloadchargeAccount() {
    var url = this.api.url + `api/charge_account/${this.api.user.residence_id}/pdf&token=${this.api.user.token}`;
    window.open(url, "invoice");
  }

  downloadReceipt(invoice) {
    if (!invoice.receipts || invoice.receipts.length == 0) {
      return;
    }
    if (this.platform.is("android") || this.platform.is("ios")) {
      var transfer: FileTransferObject = this.transfer.create();
      var url = this.api.url + "api/receipt/" + receipt.id + "/pdf?pdf=1";
      transfer
        .download(url, this.file.dataDirectory + "receipt.pdf", true, {
          headers: {
            "Auth-Token": this.api.user.token
          }
        })
        .then((entry) => {
          console.log(entry);
          this._openFile(entry.toURL());
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      var receipt = invoice.receipts[invoice.receipts.length - 1];
      this.downloadReceiptBrowser(receipt);
    }
  }

  downloadReceiptBrowser(receipt) {
    var url = this.api.url + "api/receipt/" + receipt.id + "/pdf?pdf=1&token=" + this.api.user.token;
    window.open(url, "receipt");
  }

  _openFile(url, type = "pdf") {
    this.fileOpener
      .open(url, "application/pdf")
      .then(() => console.log("File is opened"))
      .catch((e) => console.log("Error openening file", e));
  }

  viewInvoice(invoice) {
    this.navCtrl.push("InvoicePage", { invoice: invoice });
  }

  reportPayment(invoice) {
    var popover = this.popover.create("PaymentReportPage", { invoice: invoice }, { cssClass: "popover-payment" });
    popover.present();
    popover.onWillDismiss(() => {
      this.getInvoices();
    });
  }

  sendMailInvoice(invoice) {
    if (confirm(this.api.trans("__.are you sure?")))
      this.api
        .post(`invoice/${invoice.id}/email`, {})
        .then((data) => {})
        .catch(console.error);
  }

  openMenu(invoice) {
    var buttons = [
      {
        text: this.api.trans("literals.download") + " " + this.api.trans("literals.invoice"),
        icon: "document",
        cssClass: "danger",
        handler: () => {
          this.downloadinvoice(invoice);
        }
      },
      {
        text: this.api.trans("literals.view_resource") + " " + this.api.trans("literals.details"),
        icon: "ios-list-box",
        cssClass: "",
        handler: () => {
          this.viewInvoice(invoice);
        }
      }
    ];

    if (invoice.receipts && invoice.receipts.length > 0) {
      buttons.push({
        text: this.api.trans("literals.download") + " " + this.api.trans("literals.receipt"),
        icon: "filing",
        cssClass: "secondary",
        handler: () => {
          this.downloadReceipt(invoice);
        }
      });
    }

    if (invoice.status !== "paid" && invoice.status !== "cancelled") {
      buttons.push({
        text: this.api.trans("__.report payment"),
        icon: "cash",
        cssClass: "primary",
        handler: () => {
          this.reportPayment(invoice);
        }
      });
    }

    var sheet = this.actionsheet.create({
      title: this.api.trans("literals.invoice") + "  " + invoice.number,
      buttons: buttons
    });

    sheet.present();
  }

  presentPopover(Ev) {
    var buttons = [
      {
        text: this.api.trans("literals.download") + " " + this.api.trans("literals.charge account"),
        icon: "document",
        handler: () => {
          if (this.platform.is("android") || this.platform.is("ios")) {
            var transfer: FileTransferObject = this.transfer.create();
            var url = this.api.url + `api/charge_account/${this.api.user.residence_id}/pdf`;
            transfer
              .download(url, this.file.dataDirectory + "charge_account.pdf", true, {
                headers: {
                  "Auth-Token": this.api.user.token
                }
              })
              .then((entry) => {
                console.log(entry);
                this._openFile(entry.toURL());
              })
              .catch((err) => {
                console.error(err);
              });
          } else {
            return this.downloadchargeAccount();
          }
        }
      }
    ];
    let popover = this.popovermenu.create({
      buttons: buttons
    });
    popover.present({ ev: Ev });
  }
}
