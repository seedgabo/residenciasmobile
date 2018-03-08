import { Api } from './../../providers/api';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Gesture } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {
  post: any = {};
  tap = 100;
  private gesture: Gesture;
  @ViewChild('image') element;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
    if (navParams.get('postId')) {
      var postId = navParams.get('postId')
      this.getPost()
    } else {
      this.post = navParams.get('post');
    }

  }

  ionViewDidLoad() {
    this.gesture = new Gesture(this.element.nativeElement);
    //listen for the gesture
    this.gesture.listen();
    //turn on listening for pinch or rotate events
    this.gesture.on('pinch', e => this.pinchEvent(e));
  }

  getPost() {
    this.api.get('posts/' + this.post.id + "?with[]=user&wit[]=image")
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

  pinchEvent(e) {
    if (this.tap == 100) {
      this.tap = 500;
    }

    if (e.additionalEvent == "pinchout") {
      if (this.tap < 950)
        this.tap += 20;
    }
    else {
      if (this.tap > 500)
        this.tap -= 20;
    }
  }

  tapEvent(e) {
    if (this.tap == 500) {
      this.tap = 600;
    }
    else if (this.tap == 600) {
      this.tap = 700;
    }
    else if (this.tap == 700) {
      this.tap = 100;
    }
    else {
      this.tap = 500;
    }
  }

}
