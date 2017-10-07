import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPostPage } from './add-post';
import { PipesModule } from '../../pipes/pipes.module';
import { AutoCompleteModule } from 'ionic2-auto-complete';
@NgModule({
  declarations: [AddPostPage],
  imports: [
    IonicPageModule.forChild(AddPostPage),
    PipesModule,
    AutoCompleteModule
  ],
})
export class AddPostPageModule { }
