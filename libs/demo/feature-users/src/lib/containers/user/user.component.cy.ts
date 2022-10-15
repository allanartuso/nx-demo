import { MountConfig, mount } from 'cypress/angular';
import { UserComponent } from './user.component';

describe(UserComponent.name, () => {
  const config: MountConfig<UserComponent> = {
    declarations: [],
    imports: [],
    providers: []
  }

  it('renders', () => {
     mount(UserComponent, config);
  })
})
