import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NoumenaInputComponent } from './components/noumena-input/noumena-input.component';
import { NoumenaSelectComponent } from './components/noumena-select/noumena-select.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [NoumenaInputComponent, NoumenaSelectComponent]
})
export class SharedUiFormModule {}
