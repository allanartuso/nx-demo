import { DemoFormComponent } from './form.component';

describe('DemoFormComponent', () => {
  let component: DemoFormComponent;

  beforeEach(() => {
    component = new DemoFormComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits submit event', () => {
    jest.spyOn(component.submitted, 'emit');

    component.onSubmit();

    expect(component.submitted.emit).toHaveBeenCalled();
  });

  it('emits cancel event', () => {
    jest.spyOn(component.cancelled, 'emit');

    component.onCancel();

    expect(component.cancelled.emit).toHaveBeenCalled();
  });
});
