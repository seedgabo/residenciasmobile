import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { PipesModule } from '../../pipes/pipes.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    IonicPageModule.forChild(ProfilePage),
    PipesModule,
    RoundProgressModule,
  ],
})
export class ProfilePageModule { }
