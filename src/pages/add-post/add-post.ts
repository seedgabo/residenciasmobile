import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { CompleteTestService } from "../../providers/CompleteTestService";

@Component({
  selector: 'page-add-post',
  templateUrl: 'add-post.html',
})
export class AddPostPage {
  @ViewChild('searchbar') searchbar;
  post = { title: "", text: "", tags: [], user_id: this.api.user.id };
  provider;
  tags = [];
  selected_tags = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.api.get('tags').then((tags: any) => {
      console.log(tags);
      this.tags = tags;
    })
      .catch((err) => {
        console.error(err);
      });
    this.provider = {
      labelAttribute: "name",
      getResults: (q) => {
        return this.tags.filter(tag => {
          if (this.selected_tags.indexOf(tag) > -1)
            return false;
          return tag.name.toLowerCase().indexOf(q.toLowerCase()) > -1;
        });
      }
    }
  }


  createPost() {
    this.selected_tags.forEach((tag) => {
      this.post.tags.push(tag.name);
    });
    this.api.post('posts', this.post)
      .then((data) => {
        console.log(data);
        this.close();
      })
      .catch((err) => {
        console.error(err);
      })
  }
  addTag(ev) {
    this.selected_tags.push(ev);
    this.searchbar.keyword = "";
  }
  deleteTag(tag, index) {
    this.selected_tags.splice(index, 1);
  }
  close() {
    this.navCtrl.pop();
  }


}
