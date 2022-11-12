import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { MinimalRouterStateSerializer } from '@ngrx/router-store';
import { CustomRouterStateSnapshot } from './models/store.model';

@Injectable()
export class CustomRouterStateSerializer extends MinimalRouterStateSerializer {
  constructor(private readonly router: Router) {
    super();
  }

  override serialize(routerState: RouterStateSnapshot): CustomRouterStateSnapshot {
    let extrasState = {};
    const navigationState = this.router.getCurrentNavigation();
    if (navigationState) {
      extrasState = navigationState.extras.state || {};
    }

    return {
      ...super.serialize(routerState),
      extrasState
    };
  }
}
