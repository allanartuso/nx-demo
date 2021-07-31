import { DemoFormComponent } from './demo-form.component';

describe('DemoFormComponent', () => {
  let component: DemoFormComponent;

  beforeEach(() => {
    component = new DemoFormComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits submit event', () => {
    spyOn(component.submitted, 'emit');

    component.onSubmit();

    expect(component.submitted.emit).toHaveBeenCalled();
  });

  it('emits cancel event', () => {
    spyOn(component.cancelled, 'emit');

    component.onCancel();

    expect(component.cancelled.emit).toHaveBeenCalled();
  });
});
