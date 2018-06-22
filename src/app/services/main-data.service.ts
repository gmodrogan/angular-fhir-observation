import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FhirClient } from 'ng-fhir/FhirClient';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class MainDataService {

  private fhirClient: FhirClient
  private config: any = {
    'baseUrl': 'https://hapi.fhir.org/baseDstu3',
    'credentials': 'same-origin',
  };

  private fetchingPatients: boolean;

  constructor() {
    this.fhirClient = new FhirClient(this.config);
  }

  private patients$ = new BehaviorSubject(undefined);

  awaitPatients(): Observable<any> {
    return this.patients$.asObservable();
  }

  awaitPatient(id: string): Observable<any> {
    var patient$ = new BehaviorSubject(undefined);

    //read the patient from the buffer or from the server
    var patientData = _.find(this.patients$.getValue(), function (patient) {
      return patient.resource.id === id
    });

    if (patientData) {
      patient$.next(patientData);
    } else {
      this.fhirClient.search({
        type: 'Patient',
        query: {
          "_id": id
        }
      }).then((response) => {
        this.fetchingPatients = false;
        if (response.data) {
          console.log(response.data);
          patient$.next(response.data.entry[0]);
        }
      }, (err) => {
        this.fetchingPatients = false;
        console.log(err);
      });
    }
    return patient$.asObservable();
  }

  refreshPatients() {
    this.fetchingPatients = true;

    this.fhirClient.search({
      type: 'Patient',
      query: {
        "organization": "4301671"
      }
    }).then((response) => {
      this.fetchingPatients = false;
      if (response.data) {
        console.log(response.data);
        this.patients$.next(_.filter(response.data.entry, function (o) { return o.resource.resourceType === "Patient" }));
      }
    }, (err) => {
      this.fetchingPatients = false;
      // console.log(err);
    });
  }

}
