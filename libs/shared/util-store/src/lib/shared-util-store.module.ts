import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';
import { CustomRouterStateSerializer } from './router.serializer';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true
      }
    }),
    EffectsModule.forRoot(),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerializer
    })
  ]
})
export class SharedUtilStoreModule {}
