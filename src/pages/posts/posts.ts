import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";


import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-posts',
  templateUrl: 'posts.html',
})
export class PostsPage {
  posts: any = [];
  loading= true
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidEnter() {
    this.getPosts();
  }

  getPosts(refresher = null) {
    this.api.get('posts?limit=50&order[created_at]=desc&with[]=user.residence&with[]=tags&with[]=image')
      .then((data: any) => {
        console.log(data);
        this.posts = data;
        this.loading = false
        if (refresher) refresher.complete();
      })
      .catch((err) => {
        console.error(err);
        this.api.Error(err)
        this.loading = false
        if (refresher) refresher.complete();
      });
  }


  gotoPost(post) {
    this.navCtrl.push("PostPage", { post: post, postId: post.id });
  }

  createPost() {
    this.navCtrl.push('AddPostPage');
  }

  deletePost(post, index) {
    this.api.delete('posts/' + post.id)
      .then((dat) => {
        console.log(dat);
        this.posts.splice(index, index);
      })
      .catch((err) => {
        console.error(err);
      });
  }

}
