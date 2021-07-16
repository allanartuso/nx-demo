import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SgSelectComponent } from './sg-select.component';

describe('SgSelectComponent', () => {
  let component: SgSelectComponent;
  let fixture: ComponentFixture<SgSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SgSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SgSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
