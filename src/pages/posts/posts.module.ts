import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostsPage } from './posts';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [PostsPage],
  imports: [
    IonicPageModule.forChild(PostsPage),
    PipesModule
  ],
})
export class PostsPageModule { }
