import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';
import { ViewController } from 'ionic-angular/navigation/view-controller';
@IonicPage()
@Component({
  selector: 'page-ticket-editor',
  templateUrl: 'ticket-editor.html',
})
export class TicketEditorPage {
  ticket: any = {
    subject: "",
    text: "",
    status: "open",
    user_id: this.api.user.id,
    residence_id: this.api.user.residence_id,
  }
  statuses = [
    "open",
    "closed",
    "in proccess",
    "rejected"
  ]
  loading = false
  file = null
  file_name = ""
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    if (navParams.get('ticket')) {
      this.ticket = navParams.get('ticket')
    }
  }

  ionViewDidLoad() {
    console.log(this.ticket)
  }

  canSave() {
    return this.ticket.subject.length > 1 &&
      this.ticket.text.length > 1
  }

  save() {
    var promise: Promise<any>;
    this.loading = true;
    var data = {
      status: this.ticket.status,
      text: this.ticket.text,
      subject: this.ticket.subject,
      user_id: this.ticket.user_id,
      residence_id: this.ticket.residence_id,
    }
    if (this.ticket.id) {
      promise = this.api.put('tickets/' + this.ticket.id, data);
    } else {
      promise = this.api.post('tickets', data);
    }
    if (this.file) {
      promise.then((data) => {
        this.uploadFile(data.id)
      })
    }
    promise.then((data) => {
      this.loading = false;
      this.viewctrl.dismiss({ ticket: data });
      this.ticket.id = data.id;
    })
      .catch((err) => {
        this.loading = false;
        this.api.Error(err);
        console.error(err);
      })
  }

  dismiss() {
    this.viewctrl.dismiss();
  }

  askFile(visitor) {
    var filer: any = document.querySelector("#input-file-ticket")
    filer.click();
  }

  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      if (event.target.files[0].size / 1024 / 1024 > 5) {
        return this.errorFile(event.target.files[0].size)
      }
      this.file = event.target.files[0];
      this.file_name = event.target.files[0].name
    } catch (error) {
      this.file = null
      console.error(error)
    }
  }

  errorFile(size) {
    this.api.toast.create({
      message: this.api.trans('__.los archivos deben sen inferior a 5MB, (' + size / 1024 / 1024 + " MB)"),
      duration: 4000
    }).present()
  }

  uploadFile(id) {
    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.api.url + "api/files/upload/ticket/" + id, true);
    formData.append('file', this.file, this.file_name);

    xhr.onload = () => {
      if (xhr.status === 200) {
        this.api.toast.create({
          message: this.api.trans("literals.file") + " " + this.api.trans("crud.updated"),
          duration: 1500,
          showCloseButton: true,
        }).present();
      } else {
        this.api.Error({ status: xhr.status })
      }
    };
    xhr.setRequestHeader("Auth-Token", this.api.user.token)
    xhr.send(formData)
  }

}
