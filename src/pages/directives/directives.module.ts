import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DirectivesPage } from './directives';
import { PipesModule } from '../../pipes/pipes.module';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  declarations: [
    DirectivesPage,
  ],
  imports: [
    IonicPageModule.forChild(DirectivesPage),
    TreeModule,
    PipesModule
  ],
})
export class DirectivesPageModule { }
