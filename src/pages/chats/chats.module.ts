import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatsPage } from './chats';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [ChatsPage],
  imports: [
    IonicPageModule.forChild(ChatsPage),
    PipesModule
  ],
})
export class ChatsPageModule { }
