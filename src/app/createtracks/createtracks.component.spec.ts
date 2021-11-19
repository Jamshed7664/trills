import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetracksComponent } from './createtracks.component';

describe('CreatetracksComponent', () => {
  let component: CreatetracksComponent;
  let fixture: ComponentFixture<CreatetracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatetracksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatetracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
