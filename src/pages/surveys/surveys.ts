import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";
import { SurveyPage } from "../survey/survey";

@Component({
  selector: 'page-surveys',
  templateUrl: 'surveys.html',
})
export class SurveysPage {
  surveys = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.getSurveys();
  }

  getSurveys(refresher = null) {
    this.api.get('surveys?take=50&orderBy[close_time]=desc')
      .then((data: any) => {
        console.log(data);
        this.surveys = data;
        if (refresher)
          refresher.complete()
      })
      .catch((err) => {
        console.error(err);
        if (refresher)
          refresher.complete()
      });

  }

  gotoSurvey(survey) {
    this.navCtrl.push(SurveyPage, { survey: survey });
  }

}
