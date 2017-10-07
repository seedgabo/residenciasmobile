import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { PipesModule } from '../../pipes/pipes.module';
import { MomentModule } from 'angular2-moment';
@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
  ],
})
export class HomePageModule { }
