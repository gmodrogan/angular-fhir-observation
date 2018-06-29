import { Component, OnInit } from '@angular/core';
import { VitalsignService } from '../services/vitalsign/vitalsign.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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

  public alertMessage: string;

  private patientId: string;

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');

    this.getVitalsigns();
    // this.vitalsignService.refreshVitalsigns(this.patientId);
  }

  getVitalsigns() {
    this.vitalsignService.awaitVitalsigns(this.patientId)
      .subscribe(
        (vitalsigns) => {
          debugger;
          this.vitalsigns = vitalsigns;
          // this.alertMessage = "Data read performed";
        },
        (err) => {
          debugger;
        });
  }

  open() {
    const modalRef = this.modalService.open(VitalsignAddComponent, {
      centered: true,
      beforeDismiss: function () {
        return true;
      }
    });
    modalRef.result.then((result) => {
      var a = modalRef;
      // debugger;

      // let operationOutcome$ = this.vitalsignService.createVitalsign({ "aaa": "bbb" })
      // operationOutcome$.subscribe(operationOutcome => {
      //   this.alertMessage = "Vitalsign created"
      //   // this.vitalsignService.refreshVitalsigns(this.patientId);
      //   //destroy operationOutcome$
      // });


    }, (reason) => {
      // debugger;
    });
    modalRef.componentInstance.name = 'Test';
  }

}
