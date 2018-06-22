import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PatientNamePipe } from './util/patient-name/patient-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    PatientListComponent,
    PatientDetailComponent,
    NotFoundComponent,
    PatientNamePipe
],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
