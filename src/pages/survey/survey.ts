import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html',
})
export class SurveyPage {
  survey: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.survey = navParams.get('survey');
  }

}
