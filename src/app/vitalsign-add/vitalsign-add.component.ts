import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-vitalsign-add',
  templateUrl: './vitalsign-add.component.html',
  styleUrls: ['./vitalsign-add.component.css']
})
export class VitalsignAddComponent implements OnInit {

  @Input() name: string;
  myForm: FormGroup;


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,

  ) {
    this.createForm();
  }

  private createForm() {
    this.myForm = this.formBuilder.group({
      username: '',
      password: ''
    });
  }
  public submitForm() {
    this.activeModal.close(this.myForm.value);

  }

  ngOnInit() {

  }

}
