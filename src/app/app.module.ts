import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PatientListComponent } from './patient-list/patient-list.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PatientNamePipe } from './util/patient-name/patient-name.pipe';
import { VitalsignListComponent } from './vitalsign-list/vitalsign-list.component';
import { VitalsignAddComponent } from './vitalsign-add/vitalsign-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    PatientListComponent,
    PatientDetailComponent,
    NotFoundComponent,
    PatientNamePipe,
    VitalsignListComponent,
    VitalsignAddComponent
],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  entryComponents:[
    VitalsignAddComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
