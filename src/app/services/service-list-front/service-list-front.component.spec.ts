import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListFrontComponent } from './service-list-front.component';

describe('ServiceListFrontComponent', () => {
  let component: ServiceListFrontComponent;
  let fixture: ComponentFixture<ServiceListFrontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceListFrontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceListFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
