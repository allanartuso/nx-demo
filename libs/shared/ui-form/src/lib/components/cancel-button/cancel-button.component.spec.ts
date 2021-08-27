import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DemoCancelButtonComponent } from './cancel-button.component';

describe('CancelButtonComponent', () => {
  let component: DemoCancelButtonComponent;
  let fixture: ComponentFixture<DemoCancelButtonComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DemoCancelButtonComponent],
        imports: []
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoCancelButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
