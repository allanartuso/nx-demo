import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoumenaInputComponent } from './components/sg-input/sg-input.component';
import { SgSelectComponent } from './components/sg-select/sg-select.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NoumenaInputComponent, SgSelectComponent]
})
export class SharedUiFormModule {}
