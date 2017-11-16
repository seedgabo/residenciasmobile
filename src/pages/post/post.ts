import { Api } from './../../providers/api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  post: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    this.post = navParams.get('post');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

  getPost() {
    this.api.get('posts/' + this.post + "?with[]=user&wit[]=image")
      .then((data) => {
        this.post = data;
      })
      .catch(this.api.Error);
  }

  createPost() {
    this.navCtrl.push('AddPostPage');
  }

  deletePost() {
    this.api.delete('posts/' + this.post.id)
      .then((dat) => {
        console.log(dat);
        this.navCtrl.pop();
      })
      .catch((err) => {
        this.api.Error(err);
      });
  }

}