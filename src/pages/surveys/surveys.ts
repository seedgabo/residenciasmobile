import { Events } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public events: Events) {
  }

  ionViewDidLoad() {
    this.getSurveys();
    this.events.subscribe('survey:created', this.getSurveys)
    this.events.subscribe('survey:updated', this.getSurveys)
    this.events.subscribe('survey:deleted', this.getSurveys)
  }
  ionViewDidLeave() {
    this.events.unsubscribe('survey:created', this.getSurveys)
    this.events.unsubscribe('survey:updated', this.getSurveys)
    this.events.unsubscribe('survey:deleted', this.getSurveys)
  }

  getSurveys(refresher = null) {
    this.api.get('surveys?take=50&orderBy[close_time]=desc')
      .then((data: any) => {
        console.log(data);
        this.surveys = data;
        if (refresher && typeof refresher.complete === 'function')
          refresher.complete()
      })
      .catch((err) => {
        console.error(err);
        if (refresher && typeof refresher.complete === 'function')
          refresher.complete()
      });

  }

  gotoSurvey(survey) {
    this.navCtrl.push(SurveyPage, { survey: survey });
  }

}
