import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateVisitPage } from './create-visit';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [CreateVisitPage],
  imports: [
    IonicPageModule.forChild(CreateVisitPage),
    PipesModule
  ],
})
export class CreateVisitPageModule { }
