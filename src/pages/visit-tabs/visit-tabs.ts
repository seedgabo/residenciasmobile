import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-visit-tabs',
  templateUrl: 'visit-tabs.html'
})
// @IonicPage()
export class VisitTabsPage {

  visitorsRoot = 'VisitorsPage'
  visitsRoot = 'VisitsPage'


  constructor(public navCtrl: NavController) { }

}
