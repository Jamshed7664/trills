import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDetailsFrontComponent } from './service-details-front.component';

describe('ServiceDetailsFrontComponent', () => {
  let component: ServiceDetailsFrontComponent;
  let fixture: ComponentFixture<ServiceDetailsFrontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDetailsFrontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDetailsFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
