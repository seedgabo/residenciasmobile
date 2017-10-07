import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TablesPage } from './tables';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [TablesPage],
  imports: [
    IonicPageModule.forChild(TablesPage),
    PipesModule
  ],
})
export class TablesPageModule { }
