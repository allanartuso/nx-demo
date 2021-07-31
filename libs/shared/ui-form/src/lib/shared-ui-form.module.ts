import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DemoInputComponent } from './components/input/input.component';
import { DemoSelectComponent } from './components/select/select.component';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [DemoInputComponent, DemoSelectComponent]
})
export class SharedUiFormModule {}
