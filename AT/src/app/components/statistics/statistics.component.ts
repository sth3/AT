import { Component, OnInit, ViewChild  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl } from '@angular/forms';

import { DateAdapter } from '@angular/material/core';
import { DoseModel } from '../../models/statistics.model';
import { ExportService } from '../../services/export.service';
import { StatisticsService } from '../../services/statistics.service'
import { selectList } from 'src/app/models/order.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  type: number = 0;
  data: DoseModel[] = [];
  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  groupBy = new FormControl([0, 1, 2, 3, 4, 5]);
  groupByList: string[] = ['Number Of Dose', 'Creator', 'Recipe ID', 'Recipe Name', 'Order ID', 'Order Name'];
  selectTypeStats : selectList[] = [
    {
      "value": 0,
      "viewValue": "Number Of Dose"
    },
    {
      "value": 1,
      "viewValue": "Creator"
    },
    {
      "value": 2,
      "viewValue": "Recipe ID"
    },
    {
      "value": 3,
      "viewValue": "Recipe Name"
    },
    {
      "value": 4,
      "viewValue": "Order ID"
    },
    {
      "value": 5,
      "viewValue": "Order Name"
    }
  ]



  columnsToDisplay = [
    { field: 'datetime', header: 'Dátum a Čas' },
    { field: 'componentN', header: 'Meno Komponentu', },
    { field: 'componentSP', header: 'Žiadaná Hodnota' },
    { field: 'componentPV', header: 'Nadávkovaná Hodnota' },
    { field: 'noContainer', header: 'Number of Dose' },
    { field: 'orderID', header: 'ID Zákazky' },
    { field: 'orderN', header: 'Name Zákazky' },
    { field: 'recipeID', header: 'No Recipe' },
    { field: 'recipeN', header: 'Name Recipe' },
    { field: 'UserName', header: 'UserName' },
  ]
  allColumnsToDisplay = [...this.columnsToDisplay.map(c => c.field)];
  dataSource: MatTableDataSource<DoseModel> = new MatTableDataSource<DoseModel>([]);
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private statisticsService: StatisticsService,
    private exportService: ExportService,
    private dateAdapter: DateAdapter<Date>) { this.dateAdapter.setLocale('en-GB'); }

  ngOnInit(): void {
    this.loadComponents(0);
  }




  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();    
  }
  changeGroupBy() {
   console.log(this.groupBy.value);
   console.log('this.type',this.type);
   setTimeout(() => {this.statisticsService.updateSelectStat(this.groupBy.value, this.type).subscribe((groupBy) => {
    console.log('updated groupBy: ', groupBy);
  });;}, 500);
   
      
  }

  changeDate(num: number) {
    this.loadComponents(num);  
    this.columnsToDisplay = [
      { field: 'datetime', header: 'Dátum a Čas' },
      { field: 'componentN', header: 'Meno Komponentu', },
      { field: 'componentSP', header: 'Žiadaná Hodnota' },
      { field: 'componentPV', header: 'Nadávkovaná Hodnota' },
      { field: 'noContainer', header: 'Number of Dose' },
      { field: 'orderID', header: 'ID Zákazky' },
      { field: 'orderN', header: 'Name Zákazky' },
      { field: 'recipeID', header: 'No Recipe' },
      { field: 'recipeN', header: 'Name Recipe' },
      { field: 'UserName', header: 'UserName' },
    ]
   
    if(num == 1){
      this.columnsToDisplay = [        
        { field: 'componentN', header: 'Meno Komponentu', },
        { field: 'componentSP', header: 'Žiadaná Hodnota' },
        { field: 'componentPV', header: 'Nadávkovaná Hodnota' },
        { field: 'noContainer', header: 'Number of Dose' },
        { field: 'orderID', header: 'ID Zákazky' },
        { field: 'orderN', header: 'Name Zákazky' },
        { field: 'recipeID', header: 'No Recipe' },
        { field: 'recipeN', header: 'Name Recipe' },
        { field: 'UserName', header: 'UserName' },
      ]
    }
    this.allColumnsToDisplay = [...this.columnsToDisplay.map(c => c.field)];
  }


  private loadComponents(type:number) {
    this.isLoading = true;
    this.statisticsService.getStatistics(type)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        console.log('data',data);
        
        this.data = data;
        if (this.range.value.start !== null && this.range.value.end !== null) {
          this.data = data.filter((item: DoseModel) => {
            // console.log('new Date(item.datetime)',new Date(item.datetime));
            // console.log('range start', this.range.value.start);
            return new Date(item.datetime) >= this.range.value.start &&
              new Date(item.datetime) <= this.range.value.end;
          });
        } else if (this.range.value.start !== null) {
          this.data = data.filter((item: DoseModel) => {
            return new Date(item.datetime) >= this.range.value.start ;
          });
        } else if (this.range.value.end !== null) {
          this.data = data.filter((item: DoseModel) => {
            return new Date(item.datetime) <= this.range.value.end ;
          });
        }

        this.dataSource = new MatTableDataSource<DoseModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  exportCSV(visibleDataOnly: boolean) {
    const headerList = ['no', 'dateTime', 'name', 'componentSP', 'componentPV', 'idContainer', 'idOrder'];
    if (visibleDataOnly) {
      // @ts-ignore
      this.exportService.downloadFile(this.dataSource._renderData.value, headerList, 'DoseStatistics');
    } else {
      this.exportService.downloadFile(this.data, headerList, 'DoseStatistics');
    }
  }
}
