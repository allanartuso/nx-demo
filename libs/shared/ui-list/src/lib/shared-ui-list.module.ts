import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ListComponent } from './components/list/list.component';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule
  ],
  declarations: [ListComponent],
  exports: [ListComponent]
})
export class SharedUiListModule {}
