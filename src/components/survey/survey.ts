import { Component, Input, OnDestroy, AfterViewInit } from "@angular/core";
import { Api } from "../../providers/api";
import { Events, AlertController } from "ionic-angular";
import Chart from "chart.js";
var funct;
@Component({
  selector: "survey",
  templateUrl: "survey.html"
})
export class SurveyComponent implements AfterViewInit, OnDestroy {
  vote;
  _survey;
  data = [];
  labels = [];
  chart;
  colors = [
    "#2196F3",
    "#F44336",
    "#FFC107",
    "#4CAF50",
    "#9C27B0",
    "#E91E63",
    "#E67E22",
    "#82E0AA",
    "#212F3C",
    "#D7DBDD",
    "#85C1E9",
    "#F9E79F",
    "#C0392B"
  ];
  @Input()
  set survey(survey: any) {
    this._survey = survey;
    this.ngOnDestroy();
    this.ngAfterViewInit();
  }
  get survey() {
    return this._survey;
  }
  constructor(public api: Api, public events: Events, public alert: AlertController) {}

  ngAfterViewInit() {
    if (this.chart) {
      this.chart.clear();
      this.chart.destroy();
    }
    this.renderChart();
    this.getVote();
    funct = (data) => {
      this.surveyUpdated(data);
    };
    this.events.subscribe("survey:updated", funct);
  }

  ngOnDestroy() {
    this.events.unsubscribe("survey:updated", funct);
  }

  surveyUpdated(data) {
    this._survey = data.survey;
    this.renderChart();
    this.getVote();
  }

  total() {
    var sum = 0;
    Object.keys(this.survey.results).forEach((key) => {
      sum += this.survey.results[key] ? parseInt(this.survey.results[key]) : 0;
    });
    return sum;
  }

  renderChart() {
    var ctx: any = document.getElementById("surveyChart");
    ctx = ctx.getContext("2d");
    var data = (this.data = []);
    var labels = (this.labels = []);
    Object.keys(this._survey.results).forEach((key) => {
      data.push(this._survey.results[key]);
      labels.push(key);
    });
    this.chart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: data.length > 16 ? this.colors.concat(this.colors) : this.colors,
            label: this.api.trans("__.# of Votes")
          }
        ],
        labels: labels
      },
      options: {
        responsive: true
      }
    });
  }

  setVote() {
    let inputs = [];
    this._survey.responses.forEach((response) => {
      inputs.push({
        label: response.response,
        type: "radio",
        value: response.response,
        name: "response"
      });
    });
    this.alert
      .create({
        title: this._survey.question,
        subTitle: this._survey.question,
        inputs: inputs,
        buttons: [
          {
            text: this.api.trans("literals.vote"),
            handler: (data) => {
              this.postVote(data);
            }
          },
          {
            text: this.api.trans("crud.cancel"),
            handler: (data) => {},
            role: "cancel"
          }
        ]
      })
      .present();
  }

  getVote() {
    this.api
      .get(`votes?where[user_id]=${this.api.user.id}&where[survey_id]=${this._survey.id}`)
      .then((votes: any) => {
        this.vote = votes[0];
      })
      .catch((err) => {
        console.error(err);
      });
  }

  postVote(data) {
    if (!data) return;
    this.api
      .post("votes", { response: data, user_id: this.api.user.id, survey_id: this._survey.id })
      .then((data) => {
        console.log(data);
        this.vote = data;
        this.update();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  update() {
    this.api
      .get("surveys/" + this._survey.id)
      .then((survey) => {
        this._survey = survey;
        this.renderChart();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
