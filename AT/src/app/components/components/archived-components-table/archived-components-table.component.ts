import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ComponentChangeModel } from '../../../models/component.model';

import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';

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
  _data: ComponentChangeModel[] = [];
  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  @Output()
  reloadData = new EventEmitter();

  @Input()
  set data(newData: ComponentChangeModel[]) {
    newData.forEach(change => change.changes = change.change.split(', '));
    console.log('we have data: ', newData);
    this._data = newData;


    if (this.range.value.start !== null && this.range.value.end !== null) {
      this._data = newData.filter((item: ComponentChangeModel) => {
        // console.log('new Date(item.datetime)',new Date(item.datetime));
        // console.log('range start', this.range.value.start);
        return new Date(item.date) >= this.range.value.start &&
          new Date(item.date) <= this.range.value.end;
      });
    } else if (this.range.value.start !== null) {
      this._data = newData.filter((item: ComponentChangeModel) => {
        return new Date(item.date) >= this.range.value.start ;
      });
    } else if (this.range.value.end !== null) {
      this._data = newData.filter((item: ComponentChangeModel) => {
        return new Date(item.date) <= this.range.value.end ;
      });
    }

    this.dataSource = new MatTableDataSource<ComponentChangeModel>(this._data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = ((data1, filter) => {
      return JSON.stringify(data1).toLowerCase().includes(filter);
    });
  }

  dataSource: MatTableDataSource<ComponentChangeModel> = new MatTableDataSource<ComponentChangeModel>();
  columnsToDisplay = [
    { field: 'no', header: 'Number', parent: 'oldComponent' },
    { field: 'id', header: 'ID', parent: 'oldComponent' },
    { field: 'name', header: 'Component name', width: '40%', parent: 'oldComponent' },
    { field: 'date', header: 'Date of change' },
    { field: 'user', header: 'Changed by' }
  ];
  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay.map(c => c.field)];
  expandedComponent: ComponentChangeModel| null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private dateAdapter: DateAdapter<Date>) { this.dateAdapter.setLocale('en-GB')}

  ngOnInit(): void {
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  refreshData() {
    this.reloadData.emit();
  }
}
