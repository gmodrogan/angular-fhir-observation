import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainDataService } from '../services/main-data.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {

  @Input() patient: any;
  constructor(private route: ActivatedRoute, private mainDataService: MainDataService) { }

  ngOnInit() {
    this.getPatient();
  }

  getPatient() {
    const id = this.route.snapshot.paramMap.get('id');

    this.mainDataService.awaitPatient(id)
      .subscribe(patient => {
        this.patient = patient;
      });
  }

}
