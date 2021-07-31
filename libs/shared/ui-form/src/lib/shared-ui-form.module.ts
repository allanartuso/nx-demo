import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoCancelButtonComponent } from './components/cancel-button/cancel-button.component';
import { DemoFormComponent } from './components/form/form.component';
import { DemoInputComponent } from './components/input/input.component';
import { DemoSelectComponent } from './components/select/select.component';
import { DemoSubmitButtonComponent } from './components/submit-button/submit-button.component';
import { FormControlInjectorDirective } from './form-injector.directive';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [
    DemoInputComponent,
    DemoSelectComponent,
    FormControlInjectorDirective,
    DemoFormComponent,
    DemoCancelButtonComponent,
    DemoSubmitButtonComponent
  ],
  exports: [
    DemoInputComponent,
    DemoSelectComponent,
    FormControlInjectorDirective,
    DemoFormComponent,
    DemoCancelButtonComponent,
    DemoSubmitButtonComponent
  ]
})
export class SharedUiFormModule {}
