import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlistBlogComponent } from './flist-blog.component';

describe('FlistBlogComponent', () => {
  let component: FlistBlogComponent;
  let fixture: ComponentFixture<FlistBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlistBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlistBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
