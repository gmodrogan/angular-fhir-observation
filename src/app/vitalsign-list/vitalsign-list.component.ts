import { Component, OnInit } from '@angular/core';
import { VitalsignService } from '../services/vitalsign/vitalsign.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VitalsignAddComponent } from '../vitalsign-add/vitalsign-add.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-vitalsign-list',
  templateUrl: './vitalsign-list.component.html',
  styleUrls: ['./vitalsign-list.component.css']
})
export class VitalsignListComponent implements OnInit {
  public vitalsigns: any[];
  public alertMessage: string;
  private patientId: string;
  private vitalsignsBS$: BehaviorSubject<any>;

  constructor(private route: ActivatedRoute, private vitalsignService: VitalsignService, private modalService: NgbModal) {

    this.route.params.subscribe(params => {
      this.patientId = this.route.snapshot.paramMap.get('id');
      this.getVitalsigns();
    });
  }

  ngOnInit() {

  }

  getVitalsigns() {
    this.vitalsignsBS$ = this.vitalsignService.awaitVitalsigns(this.patientId);

    this.vitalsignsBS$.subscribe(
      (vitalsigns) => {
        this.vitalsigns = vitalsigns.data;
        // this.alertMessage = "Data read performed";
      },
      (err) => {
        // debugger;
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
      if (result === "close") {
        return;
      }

      let operationOutcome$ = this.vitalsignService.createVitalsign({
        patientId: this.patientId,
        quantity: result.quantity,
        code: result.code,
        unit: result.unit
      })

      operationOutcome$.subscribe(operationOutcome => {
        this.alertMessage = "Vitalsign created"
        this.vitalsignService.refreshVitalsigns(this.vitalsignsBS$);
        //destroy operationOutcome$
      });


    }, (reason) => {
      // debugger;
    });
    modalRef.componentInstance.name = 'Test';
  }

}
