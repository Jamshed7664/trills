import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashsidebarComponent } from './dashsidebar.component';

describe('DashsidebarComponent', () => {
  let component: DashsidebarComponent;
  let fixture: ComponentFixture<DashsidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashsidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
