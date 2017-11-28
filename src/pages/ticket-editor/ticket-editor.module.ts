import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TicketEditorPage } from './ticket-editor';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [
    TicketEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(TicketEditorPage),
    PipesModule
  ],
})
export class TicketEditorPageModule {}
