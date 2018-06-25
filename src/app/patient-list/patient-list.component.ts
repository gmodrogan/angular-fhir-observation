import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MainDataService } from '../services/main-data.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {

  public patients: any;

  constructor(private mainDataService: MainDataService) {

   }

  ngOnInit() {
    this.getPatients();
    this.mainDataService.refreshPatients();
  }

  getPatients() {
    this.mainDataService.awaitPatients()
      .subscribe(patients => {
        this.patients = patients;
      });
  }

  onClick() {
    this.mainDataService.refreshPatients();
  }

  // navigateToPatientDetail(patient) {
  //   this.router.navigate([
  //     'patient-detail', patient.id
  //   ]);
  // }

}
