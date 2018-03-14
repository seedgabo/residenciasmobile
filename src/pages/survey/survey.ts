import { Events } from 'ionic-angular';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Api } from "../../providers/api";
import Chart from 'chart.js';
var funct
import { IonicPage } from "ionic-angular";

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
