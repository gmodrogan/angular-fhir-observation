import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VitalsignService } from '../services/vitalsign/vitalsign.service';

@Component({
  selector: 'app-vitalsign-add',
  templateUrl: './vitalsign-add.component.html',
  styleUrls: ['./vitalsign-add.component.css']
})
export class VitalsignAddComponent implements OnInit {

  @Input() name: string;
  myForm: FormGroup;
  codes: any[]
  units: any[]


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private vitalsignService: VitalsignService) {
    this.createForm();

    vitalsignService.getCodeSystems().subscribe(
      (codeSystems) => {
        this.codes = codeSystems;
      }
    );
  }

  private createForm() {
    this.myForm = this.formBuilder.group({
      quantity: ['', Validators.required],
      code: ['', Validators.required],
      unit: ['', Validators.required]
    });

    this.myForm.get('code').valueChanges.subscribe((code) => {
      this.myForm.get('unit').reset();
      if (code == "-1") {
        this.units.length = 0
      }

      this.vitalsignService.getUnits(code).subscribe(
        (units) => {
          this.units = units;
        }
      );

    });

  }


  public submitForm() {
    this.activeModal.close(this.myForm.value);

  }

  ngOnInit() {

  }

}
