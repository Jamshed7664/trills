import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensesContractsComponent } from './licenses-contracts.component';

describe('LicensesContractsComponent', () => {
  let component: LicensesContractsComponent;
  let fixture: ComponentFixture<LicensesContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensesContractsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensesContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
