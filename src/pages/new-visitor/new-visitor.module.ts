import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewVisitorPage } from './new-visitor';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [NewVisitorPage],
  imports: [
    IonicPageModule.forChild(NewVisitorPage),
    PipesModule
  ],
})
export class NewVisitorPageModule { }
