import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackeditComponent } from './trackedit.component';

describe('TrackeditComponent', () => {
  let component: TrackeditComponent;
  let fixture: ComponentFixture<TrackeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
