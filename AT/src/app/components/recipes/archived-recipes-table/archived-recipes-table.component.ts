import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChangedRecipeModel } from '../../../models/recipe.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  @Input()
  set data(newData: ChangedRecipeModel[]) {
    newData.forEach(change => change.changes = change.change.split(', '));
    this._data = newData;
    this.dataSource = new MatTableDataSource<ChangedRecipeModel>(newData);
    this.dataSource.paginator = this.paginator;
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

}
