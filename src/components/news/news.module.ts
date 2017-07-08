import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsComponent } from './news';

@NgModule({
  declarations: [
    NewsComponent,
  ],
  imports: [
    IonicPageModule.forChild(NewsComponent),
  ],
  exports: [
    NewsComponent
  ]
})
export class NewsComponentModule {}
