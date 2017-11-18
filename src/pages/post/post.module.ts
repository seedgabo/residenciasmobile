import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostPage } from './post';

@NgModule({
  declarations: [
    PostPage,
  ],
  imports: [
    IonicPageModule.forChild(PostPage),
    PipesModule
  ],
})
export class PostPageModule { }
