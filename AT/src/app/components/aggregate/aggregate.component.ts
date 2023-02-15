import { Component, OnInit, ViewChild } from '@angular/core';
import { AggregateModel } from '../../models/agreggate.model';
import { AggregateService } from '../../services/aggregate.service';
import { DialogService } from '../../services/dialog.service';
import { EditRecipeDialogComponent } from '../edit-recipe-dialog/edit-recipe-dialog.component';

import { finalize } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportService } from '../../services/export.service';
import { NotifierService } from '../../services/notifier.service';

import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-aggregate',
  templateUrl: './aggregate.component.html',
  styleUrls: ['./aggregate.component.css']
})
export class AggregateComponent implements OnInit {

 
  data: AggregateModel[] = [];
  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  columnsToDisplay = [    
    { field: 'aNo', header: 'NO' },
    { field: 'aID', header: 'Aggregate ID' },
    { field: 'id', header: 'Component ID' },
    { field: 'name', header: 'Component Name' },
    { field: 'lastUpdate', header: 'Last update', width: '20%' },
   // { field: 'user', header: 'User Name', width: '20%' },
  ];
  isLoading = true;
  allColumnsToDisplay = [...this.columnsToDisplay.map(c => c.field)];
  dataSource: MatTableDataSource<AggregateModel> = new MatTableDataSource<AggregateModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private aggregateService: AggregateService,
    private dialogService: DialogService,
    private exportService: ExportService,
    private notifierService: NotifierService,
    private dateAdapter: DateAdapter<Date>) {
      this.dateAdapter.setLocale('en-GB');
}

  ngOnInit(): void {
    this.loadAggregate();
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  changeDate() {
    this.loadAggregate();  
  }

  loadAggregate() {
    this.isLoading = true;
    this.aggregateService.getAggregates()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((response:AggregateModel[]) => {
        console.log('data: ', response);
        this.data = response;
        if (this.range.value.start !== null && this.range.value.end !== null) {
          this.data = response.filter((item: AggregateModel) => {
            // console.log('new Date(item.datetime)',new Date(item.datetime));
            // console.log('range start', this.range.value.start);
            return new Date(item.lastUpdate) >= this.range.value.start &&
              new Date(item.lastUpdate) <= this.range.value.end;
          });
        } else if (this.range.value.start !== null) {
          this.data = response.filter((item: AggregateModel) => {
            return new Date(item.lastUpdate) >= this.range.value.start ;
          });
        } else if (this.range.value.end !== null) {
          this.data = response.filter((item: AggregateModel) => {
            return new Date(item.lastUpdate) <= this.range.value.end ;
          });
        }
        this.dataSource = new MatTableDataSource<AggregateModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      })
   }


   exportCSV(visibleDataOnly: boolean) {
    const headerList = ['aNo', 'aID', 'id', 'name', 'lastUpdate', 'user'];
    if (visibleDataOnly) {
      // @ts-ignore
      this.exportService.downloadFile(this.dataSource._renderData.value, headerList, 'Aggregate');
    } else {
      this.exportService.downloadFile(this.data, headerList, 'Aggregate');
    }
  }
}
