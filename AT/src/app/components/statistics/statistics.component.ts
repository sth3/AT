import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {FormGroup, FormControl} from '@angular/forms';

import { DoseModel } from '../../models/statistics.model';
import { ExportService } from '../../services/export.service';
import { StatisticsService } from '../../services/statistics.service'

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  data: DoseModel[] = [];
  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
 

  columnsToDisplay = [
    { field: 'no', header: 'Poradové čislo' },
    { field: 'datetime', header: 'Dátum a Čas' },
    { field: 'name', header: 'Meno Komponentu', width: '40%' },
    { field: 'componentSP', header: 'Žiadaná Hodnota' },
    { field: 'componentPV', header: 'Nadávkovaná Hodnota' },
    { field: 'idContainer', header: 'ID Kontajnera' },
    { field: 'idOrder', header: 'ID Zákazky' },
  ]
  allColumnsToDisplay = [...this.columnsToDisplay.map(c => c.field)];
  dataSource: MatTableDataSource<DoseModel> = new MatTableDataSource<DoseModel>([]);
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private statisticsService: StatisticsService,
              private exportService: ExportService,) { }

  ngOnInit(): void {
    this.loadComponents();
  }



  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  private loadComponents() {
    this.isLoading = true;
    this.statisticsService.getDoseStatistics()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        console.log('components loaded: ', data);
        this.data = data;
        this.dataSource = new MatTableDataSource<DoseModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  exportCSV(visibleDataOnly: boolean) {
    const headerList = ['no', 'dateTime', 'name', 'componentSP', 'componentPV', 'idContainer', 'idOrder' ];
    if (visibleDataOnly) {
      // @ts-ignore
      this.exportService.downloadFile(this.dataSource._renderData.value, headerList, 'DoseStatistics');
    } else {
      this.exportService.downloadFile(this.data, headerList, 'DoseStatistics');
    }
  }
}
