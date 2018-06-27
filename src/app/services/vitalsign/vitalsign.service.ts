import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
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
  private dataStore = {
    vitalsigns: []
  }


  awaitVitalsigns(patientId: string): Observable<any> {
    // TODO: filter by patient Id, cache the results in local dataStore for this patient
    return this.vitalsigns$.asObservable();
  }

  refreshVitalsigns(patientId: string) {
    this.dataStore.vitalsigns.length = 0; //clear the store
    this.fetchingVitalsigns = true;

    this.fhirClient.search({
      type: 'Observation',
      query: {
        'patient': patientId, // '4301671'
        "_count": "10"
      }
    }).then((response) => {
      // debugger;
      this.fetchingVitalsigns = false;
      if (response) {
        console.log(new Date());
        console.log(response.data);

        // TODO: append the results, cache the old ones
        this.dataStore.vitalsigns = this.dataStore.vitalsigns.concat(_.filter(response.data.entry, function (o) { return o.resource.resourceType === 'Observation'; }));
        this.vitalsigns$.next(Object.assign({}, this.dataStore).vitalsigns);

        // recursive way of loading the rest of the data  https://github.com/FHIR/fhir.js/issues/17
        if(response.data.total > response.data.entry.length){
          this.getNextPages(response.data);
        }
      }
    }, (err) => {
      this.fetchingVitalsigns = false;
      // console.log(err);
    });
  }

  getNextPages(bundle) {
    this.fhirClient.nextPage({
      bundle: bundle
    }).then((response) => {
      // debugger;
      this.dataStore.vitalsigns = this.dataStore.vitalsigns.concat(_.filter(response.data.entry, function (o) { return o.resource.resourceType === 'Observation'; }));
      this.vitalsigns$.next(Object.assign({}, this.dataStore).vitalsigns);

      if (response.data.link[1].relation === "next") { // find a nicer way
        this.getNextPages(response.data);
      }
    }, (err) => {
      // debugger;
    });
  }

  createVitalsign(vitalsign: any) {
    let operatationOutcome$ = new Subject();


    let vitalsignFhir = {
      "resourceType": "Observation",
      // "id": "heart-rate",
      "meta": {
        "profile": [
          "http://hl7.org/fhir/StructureDefinition/vitalsigns"
        ]
      },
      "text": {
        "status": "generated",
        "div": ""
      },
      "status": "final",
      "category": [
        {
          "coding": [
            {
              "system": "http://hl7.org/fhir/observation-category",
              "code": "vital-signs",
              "display": "Vital Signs"
            }
          ],
          "text": "Vital Signs"
        }
      ],
      "code": {
        "coding": [
          {
            "system": "http://loinc.org",
            "code": "8867-4",
            "display": "Heart rate"
          }
        ],
        "text": "Heart rate"
      },
      "subject": {
        "reference": "Patient/4301673"
      },
      "effectiveDateTime": new Date().toJSON(),
      "valueQuantity": {
        "value": 44,
        "unit": "beats/minute",
        "system": "http://unitsofmeasure.org",
        "code": "/min"
      }
    };

    // debugger;
    this.fhirClient.create({
      type: "Observation",
      data: vitalsignFhir

    }).then((response) => {
      // debugger;
      // the response 201 does not provide the Observation ID. It provides an OperationOutcome resource. Refresh of the entire list is needed. TO BE IMPROVED
      operatationOutcome$.next(response.data);
    }, (err) => {
      // debugger;
    });

    return operatationOutcome$.asObservable();
  }

}


