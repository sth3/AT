import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { ChangedRecipeModel } from '../../../models/recipe.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-archived-recipes-table',
  templateUrl: './archived-recipes-table.component.html',
  styleUrls: ['./archived-recipes-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ArchivedRecipesTableComponent implements OnInit {

  _data: ChangedRecipeModel[] = [];
  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  @Output()
  reloadData = new EventEmitter();

  @Input()
  set data(newData: ChangedRecipeModel[]) {
    newData.forEach(change => change.changes = change.change.split(', '));
    this._data = newData;

    if (this.range.value.start !== null && this.range.value.end !== null) {
      this._data = newData.filter((item: ChangedRecipeModel) => {
        // console.log('new Date(item.datetime)',new Date(item.datetime));
        // console.log('range start', this.range.value.start);
        return new Date(item.date) >= this.range.value.start &&
          new Date(item.date) <= this.range.value.end;
      });
    } else if (this.range.value.start !== null) {
      this._data = newData.filter((item: ChangedRecipeModel) => {
        return new Date(item.date) >= this.range.value.start ;
      });
    } else if (this.range.value.end !== null) {
      this._data = newData.filter((item: ChangedRecipeModel) => {
        return new Date(item.date) <= this.range.value.end ;
      });
    }
    this.dataSource = new MatTableDataSource<ChangedRecipeModel>(this._data );
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = ((data1, filter) => {
      return JSON.stringify(data1).toLowerCase().includes(filter);
    });
  }
  dataSource: MatTableDataSource<ChangedRecipeModel> = new MatTableDataSource<ChangedRecipeModel>();
  columnsToDisplay = [
    { field: 'no', header: 'Number', parent: 'oldRecipe' },
    { field: 'id', header: 'ID', parent: 'oldRecipe' },
    { field: 'name', header: 'Recipe name', width: '40%', parent: 'oldRecipe' },
    { field: 'date', header: 'Date of change' },
    { field: 'user', header: 'Changed by' }
  ];
  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay.map(c => c.field)];
  expandedRecipe: ChangedRecipeModel| null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() { }

  ngOnInit(): void {
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  refreshData() {
    this.reloadData.emit();
  }

}
