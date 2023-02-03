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
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Component Name' },
    { field: 'lastUpdate', header: 'Last update', width: '20%' },
    { field: 'user', header: 'User Name', width: '20%' },
  ];
  isLoading = true;
 
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

  loadAggregate() {
    this.isLoading = true;
    this.aggregateService.getAggregates()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((response:AggregateModel[]) => {
        console.log('data: ', response);
        this.data = response;

        
        this.dataSource = new MatTableDataSource<AggregateModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      })
   }

}
