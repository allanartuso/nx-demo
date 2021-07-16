import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoumenaInputComponent } from './sg-input.component';

describe('SgInputComponent', () => {
  let component: NoumenaInputComponent;
  let fixture: ComponentFixture<NoumenaInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NoumenaInputComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NoumenaInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
