import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateVisitPage } from './create-visit';

@NgModule({
  declarations: [
    CreateVisitPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateVisitPage),
  ],
  exports: [
    CreateVisitPage
  ]
})
export class CreateVisitPageModule {}
