import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { PasswordChangePage } from "./password-change";
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [PasswordChangePage],
  imports: [IonicPageModule.forChild(PasswordChangePage), PipesModule]
})
export class PasswordChangePageModule {}
