import { MountConfig, mount } from 'cypress/angular';
import { UserFormComponent } from './user-form.component';

describe(UserFormComponent.name, () => {
  const config: MountConfig<UserFormComponent> = {
    declarations: [],
    imports: [],
    providers: []
  }

  it('renders', () => {
     mount(UserFormComponent, config);
  })
})
