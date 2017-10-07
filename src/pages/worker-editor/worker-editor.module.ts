import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkersEditorPage } from './worker-editor';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [WorkersEditorPage],
  imports: [
    IonicPageModule.forChild(WorkersEditorPage),
    PipesModule
  ],
})
export class WorkersEditorPageModule { }
