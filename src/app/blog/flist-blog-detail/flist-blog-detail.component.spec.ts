import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlistBlogDetailComponent } from './flist-blog-detail.component';

describe('FlistBlogDetailComponent', () => {
  let component: FlistBlogDetailComponent;
  let fixture: ComponentFixture<FlistBlogDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlistBlogDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlistBlogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
