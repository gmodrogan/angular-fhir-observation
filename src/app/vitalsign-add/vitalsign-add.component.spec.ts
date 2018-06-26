import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsignAddComponent } from './vitalsign-add.component';

describe('VitalsignAddComponent', () => {
  let component: VitalsignAddComponent;
  let fixture: ComponentFixture<VitalsignAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalsignAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalsignAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
