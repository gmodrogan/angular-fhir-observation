import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FhirClient } from 'ng-fhir/FhirClient';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class VitalsignService {

  private fhirClient: FhirClient;
  private config: any = {
    'baseUrl': 'https://hapi.fhir.org/baseDstu3',
    'credentials': 'same-origin',
  };

  private fetchingVitalsigns: boolean;

  constructor() {
    this.fhirClient = new FhirClient(this.config);
  }

  private vitalsigns$ = new BehaviorSubject(undefined);

  awaitVitalsigns(patientId: string): Observable<any> {
    // TODO: filter by patient Id, cache the results
    return this.vitalsigns$.asObservable();
  }

  refreshVitalsigns(patientId: string) {
    this.fetchingVitalsigns = true;

    this.fhirClient.search({
      type: 'Observation',
      query: {
        'patient': patientId // '4301671'
      }
    }).then((response) => {
      this.fetchingVitalsigns = false;
      if (response.data) {
        console.log(response.data);
        // TODO: append the results, cache the old ones
        this.vitalsigns$.next(_.filter(response.data.entry, function (o) { return o.resource.resourceType === 'Observation'; }));
      }
    }, (err) => {
      this.fetchingVitalsigns = false;
      // console.log(err);
    });
  }
}
