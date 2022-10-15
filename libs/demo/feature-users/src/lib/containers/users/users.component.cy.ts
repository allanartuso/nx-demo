import { MountConfig, mount } from 'cypress/angular';
import { UsersComponent } from './users.component';

describe(UsersComponent.name, () => {
  const config: MountConfig<UsersComponent> = {
    declarations: [],
    imports: [],
    providers: []
  }

  it('renders', () => {
     mount(UsersComponent, config);
  })
})
