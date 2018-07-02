import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { map, tap, catchError } from "rxjs/operators";
import { FhirClient } from 'ng-fhir/FhirClient';
import * as _ from 'lodash';

//TODO Split the Behavior Subject concept in a separate file, like a model and leave only the http calls in the service

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/fhir+json',
    'Cache-Control': 'no-cache',
    'prefer': 'representation'
  })
};

@Injectable({
  providedIn: 'root'
})
export class VitalsignService {

  private generatedBehaviorSubjects$: BehaviorSubject<any>[] = [];

  private config: any = {
    baseUrl: 'https://hapi.fhir.org/baseDstu3/',
    credentials: 'same-origin',
  };

  constructor(private httpClient: HttpClient) {

  }

  awaitVitalsigns(patientId: string): BehaviorSubject<any> {
    // return a BehaviorSubject, create a new one if not existing
    let behaviorSubject$ = _.find(this.generatedBehaviorSubjects$, function (bs) {
      return bs.getValue().patientId === patientId
    });

    if (!behaviorSubject$) {
      behaviorSubject$ = new BehaviorSubject({
        patientId: patientId,
        data: []
      });

      this.generatedBehaviorSubjects$.push(behaviorSubject$);

      // read the data only first time when requesting Observations for this patient.
      // Then leave the component (consumer) to decide when the data should be refreshed.
      this.refreshVitalsigns(behaviorSubject$);
    }

    return behaviorSubject$;
  }

  refreshVitalsigns(vitalsignsBS$: BehaviorSubject<any>) {
    //clear the old data
    let oldValue = vitalsignsBS$.getValue();
    vitalsignsBS$.next({
      patientId: oldValue.patientId,
      data: []
    });

    let patientId = vitalsignsBS$.getValue().patientId;

    this.httpClient.get<any>(`${this.config.baseUrl}/Observation?patient=${patientId}`, httpOptions).pipe(
      tap(response => {
        // debugger;
      }),
      map(response => {
        // debugger;
        let newVitalsigns = _.filter(response.entry, function (o) { return o.resource.resourceType === 'Observation'; });
        let oldValue = vitalsignsBS$.getValue();

        vitalsignsBS$.next({
          patientId: oldValue.patientId,
          data: _.concat(oldValue.data, newVitalsigns)
        });

        let nextPage = _.find(response.link, (o) => o.relation === "next")
        if (nextPage) {
          this.getNextPages(nextPage, vitalsignsBS$);
        }
      })

    ).subscribe();
  }

  getNextPages(nextPage, vitalsignsBS$) {
    let nextPageUrl = nextPage.url;

    this.httpClient.get<any>(nextPageUrl, httpOptions).pipe(
      tap(response => {
        // debugger;
      }),
      map(response => {
        // debugger;
        let newVitalsigns = _.filter(response.entry, function (o) { return o.resource.resourceType === 'Observation'; });
        let oldValue = vitalsignsBS$.getValue();

        vitalsignsBS$.next({
          patientId: oldValue.patientId,
          data: _.concat(oldValue.data, newVitalsigns)
        });

        let nextPage = _.find(response.link, (o) => o.relation === "next")
        if (nextPage) {
          this.getNextPages(nextPage, vitalsignsBS$);
        }
      })

    ).subscribe();
  }

  createVitalsign(vitalsign: any): Observable<any> {
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
        "reference": "Patient/" + vitalsign.patientId
      },
      "effectiveDateTime": new Date().toJSON(),
      "valueQuantity": {
        "value": vitalsign.quantity,
        "unit": "beats/minute",
        "system": "http://unitsofmeasure.org",
        "code": "/min"
      }
    };

    return this.httpClient.post<any>(`${this.config.baseUrl}/Observation`, vitalsignFhir, httpOptions).pipe(
      tap(response => {
        // debugger;
      }),
      map(response => {
        // debugger;
        return response;
      })

    )
  }



}



/** Service implementation based on NG-FHIR js library client
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
*/

