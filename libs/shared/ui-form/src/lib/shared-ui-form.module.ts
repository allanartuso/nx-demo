import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoInputComponent } from './components/input/input.component';
import { DemoSelectComponent } from './components/select/select.component';
import { FormControlInjectorDirective } from './form-injector.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DemoInputComponent, DemoSelectComponent, FormControlInjectorDirective],
  exports: [DemoInputComponent, DemoSelectComponent, FormControlInjectorDirective]
})
export class SharedUiFormModule {}
