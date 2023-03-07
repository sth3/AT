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


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {
  type: number = 0;  
  data: DoseModel[] = [];
  filter:number[] = [];
  quickFilter: string = '';  
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  groupBy = new FormControl([0, 1, 2, 3, 4, 5, 6]);  
   columnsToDisplay = [
    { field: 'datetime', header: 'Dátum a Čas' , id:7},
    { field: 'componentN', header: 'Meno Komponentu', id:8 },
    { field: 'componentSP', header: 'Žiadaná Hodnota', id:9 },
    { field: 'componentPV', header: 'Nadávkovaná Hodnota', id:10 },
    { field: 'noContainer', header: 'Number of Dose', id:0 },
    { field: 'orderID', header: 'ID Zákazky', id:4 },
    { field: 'orderN', header: 'Name Zákazky', id:5 },
    { field: 'recipeID', header: 'No Recipe', id:2 },
    { field: 'recipeN', header: 'Name Recipe', id:3 },
    { field: 'UserName', header: 'UserName', id:1 },
    { field: 'station', header: 'Station', id:6 },
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
    this.filter = [...this.groupBy.value, 7,8,9,10]  
    this.loadComponents(this.type, this.groupBy.value);
  }




  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();    
  }
  changeGroupBy() {
   console.log(this.groupBy.value);
   console.log('this.type',this.type);
   setTimeout(() => {    
      this.loadComponents(this.type, this.groupBy.value);
      this.filter =[...this.groupBy.value, 8,9,10]  
      if(this.type == 0) {
        this.filter = [...this.groupBy.value, 7,8,9,10]    
      } else if (this.type == 2){
        this.filter = [...this.groupBy.value, 7,8,9,10]    
      }
      
      this.allColumnsToDisplay = [...this.columnsToDisplay.filter(   val => this.filter.includes(val.id) ).map(c => c.field)];
    }, 300);  
    
   
    
  }  

  changeDate(type: number) {
    this.loadComponents(type, this.groupBy.value);          
   
  }


   loadComponents(type:number, groupBy:Number[]) {
    this.isLoading = true;
    this.statisticsService
    //.getStatistics(type)
    .updateSelectStat(groupBy, type)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {               
        this.data = data;
        console.log(data);
        
        
        this.dataPicker(data)        
      })
  }

  dataForTable(data: DoseModel[]){
    this.dataSource = new MatTableDataSource<DoseModel>(data);   
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  dataPicker(data: DoseModel[]) {    
        
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
        this.dataForTable(this.data) 
  }

  exportCSV(visibleDataOnly: boolean) {
    console.log([...this.columnsToDisplay.filter(   val => this.filter.includes(val.id) ).map(c => c.field)])
    const headerList = [...this.columnsToDisplay.filter(   val => this.filter.includes(val.id) ).map(c => c.field)];
    //if (visibleDataOnly) {
      // @ts-ignore
      this.exportService.downloadFile(this.dataSource._renderData.value, headerList, 'DoseStatistics');
   // } else {
      //this.exportService.downloadFile(this.data, headerList, 'DoseStatistics');
    //}
  }
}


