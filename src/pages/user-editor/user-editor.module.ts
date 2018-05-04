import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserEditorPage } from './user-editor';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [
    UserEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(UserEditorPage),
    PipesModule
  ],
})
export class UserEditorPageModule { }
