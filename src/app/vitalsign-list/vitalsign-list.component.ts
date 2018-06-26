import { Component, OnInit } from '@angular/core';
import { VitalsignService } from '../services/vitalsign/vitalsign.service';
import { ActivatedRoute } from '@angular/router';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { VitalsignAddComponent } from '../vitalsign-add/vitalsign-add.component';

@Component({
  selector: 'app-vitalsign-list',
  templateUrl: './vitalsign-list.component.html',
  styleUrls: ['./vitalsign-list.component.css']
})
export class VitalsignListComponent implements OnInit {
  public vitalsigns: any[];
  constructor(private route: ActivatedRoute, private vitalsignService: VitalsignService, private modalService: NgbModal) {

  }

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

  open() {
    const modalRef = this.modalService.open(VitalsignAddComponent, {
      centered: true,
      beforeDismiss: function() {
        return true;
      }
    });
    modalRef.result.then((result) => {
      var a = modalRef;
      debugger;
    }, (reason) => {
      debugger;
    });
    modalRef.componentInstance.name = 'George';
  }

}
