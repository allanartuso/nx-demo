import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RequestState } from '@demo/shared/data-model';
import { DemoSubmitButtonComponent } from './submit-button.component';

describe('SubmitButtonComponent', () => {
  let component: DemoSubmitButtonComponent;
  let fixture: ComponentFixture<DemoSubmitButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DemoSubmitButtonComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('state getters', () => {
    it('is idle if the request state is idle', () => {
      component.requestState = RequestState.IDLE;

      expect(component.isIdle).toBe(true);
    });

    it('is in progress if the request state is in progress', () => {
      component.requestState = RequestState.IN_PROGRESS;

      expect(component.isInProgress).toBe(true);
    });

    it('is successful if the request state is successful', () => {
      component.requestState = RequestState.SUCCESS;

      expect(component.isSuccess).toBe(true);
    });

    it('is in failure if the request state is failure', () => {
      component.requestState = RequestState.FAILURE;

      expect(component.isFailure).toBe(true);
    });
  });

  it('when receiving a request state success, set the state to idle after a specified time', () => {
    jest.useFakeTimers();

    component.requestState = RequestState.SUCCESS;

    expect(component.isSuccess).toBe(true);
    jest.runAllTimers();
    expect(component.isIdle).toBe(true);
    jest.useRealTimers();
  });

  describe('set state when receiving multiple requests state', () => {
    it('if at least one request state is in progress, the button state is set to in progress', () => {
      component.requestState = [RequestState.FAILURE, RequestState.IN_PROGRESS];

      expect(component.isInProgress).toBe(true);
    });

    it('if any request state is in progress and at least one request state is failure, the button state is set to failure', () => {
      component.requestState = [RequestState.FAILURE, RequestState.SUCCESS];

      expect(component.isFailure).toBe(true);
    });

    it('if any request state is in progress or failure and at least one request state is success, the button state is set to success', () => {
      component.requestState = [RequestState.IDLE, RequestState.SUCCESS];

      expect(component.isSuccess).toBe(true);
    });

    it('if all requests state are idle, the button state is set to idle', () => {
      component.requestState = [RequestState.IDLE, RequestState.IDLE];

      expect(component.isIdle).toBe(true);
    });
  });
});
