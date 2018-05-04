import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InvoicesPage } from './invoices';
import { PipesModule } from '../../pipes/pipes.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [InvoicesPage],
  imports: [
    NgxDatatableModule,
    IonicPageModule.forChild(InvoicesPage),
    PipesModule
  ],
})
export class InvoicesPageModule { }
