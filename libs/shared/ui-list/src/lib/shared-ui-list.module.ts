import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TableComponent } from './components/table/table.component';
import { DemoMatPaginatorIntl } from './services/custom-paginator.service';

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
  providers: [{ provide: MatPaginatorIntl, useClass: DemoMatPaginatorIntl }],
  declarations: [TableComponent],
  exports: [TableComponent]
})
export class SharedUiListModule {}
