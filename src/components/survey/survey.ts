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
  chart;
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
      this.update();
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
    sum += parseInt(this._survey.results[1] ? this._survey.results[1] : 0);
    sum += parseInt(this._survey.results[2] ? this._survey.results[2] : 0);
    sum += parseInt(this._survey.results[3] ? this._survey.results[3] : 0);
    sum += parseInt(this._survey.results[4] ? this._survey.results[4] : 0);
    sum += parseInt(this._survey.results[5] ? this._survey.results[5] : 0);
    sum += parseInt(this._survey.results[6] ? this._survey.results[6] : 0);

    return sum;
  }

  renderChart() {
    var ctx: any = document.getElementById("surveyChart");
    ctx = ctx.getContext("2d");
    var data = [];
    var labels = [];
    if (this._survey.response_1) {
      data.push(this._survey.results[1]);
      labels.push(this._survey.response_1);
    }
    if (this._survey.response_2) {
      data.push(this._survey.results[2]);
      labels.push(this._survey.response_2);
    }
    if (this._survey.response_3) {
      data.push(this._survey.results[3]);
      labels.push(this._survey.response_3);
    }
    if (this._survey.response_4) {
      data.push(this._survey.results[4]);
      labels.push(this._survey.response_4);
    }
    if (this._survey.response_5) {
      data.push(this._survey.results[5]);
      labels.push(this._survey.response_5);
    }
    if (this._survey.response_6) {
      data.push(this._survey.results[6]);
      labels.push(this._survey.response_6);
    }
    this.chart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: ["#2196F3", "#F44336", "#FFC107", "#4CAF50", "#9C27B0", "#E91E63"],
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
    this.alert
      .create({
        title: this._survey.question,
        subTitle: this._survey.question,
        inputs: [
          {
            label: this._survey.response_1,
            type: "radio",
            value: "1",
            name: "response",
            checked: true
          },
          {
            label: this._survey.response_2,
            type: "radio",
            value: "2",
            name: "response"
          },
          {
            label: this._survey.response_3,
            type: "radio",
            value: "3",
            name: "response"
          },
          {
            label: this._survey.response_4,
            type: "radio",
            value: "4",
            name: "response"
          },
          {
            label: this._survey.response_5,
            type: "radio",
            value: "5",
            name: "response"
          },
          {
            label: this._survey.response_6,
            type: "radio",
            value: "6",
            name: "response"
          }
        ],
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
