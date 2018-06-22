import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainDataService {

constructor() { }

  private patients = new BehaviorSubject(undefined);

  awaitPatients():Observable<any>{
    return this.patients.asObservable();
  }

  refreshPatients(){
    this.patients.next(
      [
        {
          id: 1,
          name: "Patient 1"
        },
        {
          id: 2,
          name: "Patient 2"
        }
      ]
    )
  }

}
