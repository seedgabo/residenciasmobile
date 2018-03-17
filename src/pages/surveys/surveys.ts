import { Events, Platform } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from "../../providers/api";

var func
import { IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'page-surveys',
  templateUrl: 'surveys.html',
})
export class SurveysPage {
  surveys = [];
  survey = null
  mobile = false
  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public api: Api, public events: Events) {
    this.mobile = this.platform.is('android') || this.platform.is('ios')
  }

  ionViewDidLoad() {
    this.getSurveys();
    func = (data) => {
      this.getSurveys(data)
    }
    this.events.subscribe('survey:created', func)
    this.events.subscribe('survey:updated', func)
    this.events.subscribe('survey:deleted', func)
  }
  ionViewDidEnter() {
    this.getSurveys();

  }

  ionViewDidLeave() {
    this.events.unsubscribe('survey:created', func)
    this.events.unsubscribe('survey:updated', func)
    this.events.unsubscribe('survey:deleted', func)
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
    if (this.mobile) {
      this.navCtrl.push('SurveyPage', { survey: survey });
    }
    else {
      this.survey = survey
    }
  }

}
