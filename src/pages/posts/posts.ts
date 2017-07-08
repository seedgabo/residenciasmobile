import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";

@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html',
})
export class PostsPage {
  posts: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.getPosts()
  }

  getPosts() {
    this.api.get('posts?limit=50&order[created_at]=desc&with[]=user.residence')
      .then((data: any) => {
        console.log(data);
        this.posts = data;
      })
      .catch((err) => {
        console.error(err);
      });
  }

}
