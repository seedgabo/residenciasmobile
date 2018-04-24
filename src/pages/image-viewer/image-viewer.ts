import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";
import { DomSanitizer } from "@angular/platform-browser";
@IonicPage()
@Component({
  selector: "page-image-viewer",
  templateUrl: "image-viewer.html"
})
export class ImageViewerPage {
  title;
  url;
  video;
  constructor(public viewCtrl: ViewController, public navParams: NavParams, public sanitizie: DomSanitizer) {
    if (this.navParams.get("url")) {
      this.url = this.sanitizie.bypassSecurityTrustUrl(this.navParams.get("url"));
    }
    if (this.navParams.get("video")) {
      this.video = this.sanitizie.bypassSecurityTrustResourceUrl(this.navParams.get("video"));
    }
    if (this.navParams.get("title")) {
      this.title = this.navParams.get("title");
    }
  }

  ionViewDidLoad() {}

  close() {
    this.viewCtrl.dismiss();
  }
}
