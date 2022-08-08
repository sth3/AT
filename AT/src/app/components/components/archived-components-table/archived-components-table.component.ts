import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChangedComponentModel } from '../../../models/recipe.model';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-archived-components-table',
  templateUrl: './archived-components-table.component.html',
  styleUrls: ['./archived-components-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ArchivedComponentsTableComponent implements OnInit {
  _data: ChangedComponentModel[] = [];

  @Input()
  set data(newData: ChangedComponentModel[]) {
    newData.forEach(change => change.changes = change.change.split(', '));
    console.log('we have data: ', newData);
    this._data = newData;
    this.dataSource = new MatTableDataSource<ChangedComponentModel>(newData);
    this.dataSource.paginator = this.paginator;
  }

  dataSource: MatTableDataSource<ChangedComponentModel> = new MatTableDataSource<ChangedComponentModel>();
  columnsToDisplay = [
    { field: 'no', header: 'Number', parent: 'oldComponent' },
    { field: 'id', header: 'ID', parent: 'oldComponent' },
    { field: 'name', header: 'Component name', width: '40%', parent: 'oldComponent' },
    { field: 'date', header: 'Date of change' },
    { field: 'user', header: 'Changed by' }
  ];
  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay.map(c => c.field)];
  expandedComponent: ChangedComponentModel| null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor() { }

  ngOnInit(): void {
  }

}
