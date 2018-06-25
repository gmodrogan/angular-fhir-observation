import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VitalsignListComponent } from './vitalsign-list.component';

describe('VitalsignListComponent', () => {
  let component: VitalsignListComponent;
  let fixture: ComponentFixture<VitalsignListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VitalsignListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VitalsignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
