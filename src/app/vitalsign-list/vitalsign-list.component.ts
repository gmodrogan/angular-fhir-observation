import { Component, OnInit } from '@angular/core';
import { VitalsignService } from '../services/vitalsign/vitalsign.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vitalsign-list',
  templateUrl: './vitalsign-list.component.html',
  styleUrls: ['./vitalsign-list.component.css']
})
export class VitalsignListComponent implements OnInit {
  public vitalsigns: any[];
  constructor(private route: ActivatedRoute, private vitalsignService: VitalsignService) { }
  private patientId: string;
  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');

    this.getVitalsigns();
    this.vitalsignService.refreshVitalsigns(this.patientId);
  }

  getVitalsigns() {
    this.vitalsignService.awaitVitalsigns(this.patientId)
      .subscribe(vitalsigns => {
        // debugger;
        this.vitalsigns = vitalsigns;
      });
  }

}
