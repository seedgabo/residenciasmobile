import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocumentsPage } from './documents';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [DocumentsPage],
  imports: [
    IonicPageModule.forChild(DocumentsPage),
    PipesModule
  ],
})
export class DocumentsPageModule { }
