import { NgModule } from '@angular/core';
import { SurveyComponent } from './survey/survey';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../pipes/pipes.module';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [SurveyComponent],
	imports: [CommonModule, IonicModule, PipesModule],
	exports: [SurveyComponent]
})
export class ComponentsModule { }
