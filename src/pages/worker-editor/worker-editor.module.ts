import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkersEditorPage } from './worker-editor';
@NgModule({
  declarations: [WorkersEditorPage],
  imports: [
    IonicPageModule.forChild(WorkersEditorPage)
  ],
})
export class WorkersEditorPageModule { }
