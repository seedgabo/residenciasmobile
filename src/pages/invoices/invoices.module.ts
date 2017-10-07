import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicesPage } from './invoices';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [InvoicesPage],
  imports: [
    IonicPageModule.forChild(InvoicesPage),
    PipesModule
  ],
})
export class InvoicesPageModule { }
