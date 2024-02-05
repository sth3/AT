import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { TranslateService } from '@ngx-translate/core';
import { finalize, BehaviorSubject } from 'rxjs';

import { ComponentSapModel } from '../../models/component.model';

import { ExportService } from '../../services/export.service';
import { ComponentSapService } from '../../services/component-sap.service';
@Component({
  selector: 'app-components-sap',
  templateUrl: './components-sap.component.html',
  styleUrls: ['./components-sap.component.css']
})
export class ComponentsSapComponent implements OnInit {
  data: ComponentSapModel[] = [];
  isLoading: boolean = false;
  quickFilter: string = '';
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  columnsToDisplay = [
    { field: 'rowID', header: '' },
    { field: 'materialID', header: '' },
    { field: 'materialName', header: '', width: '40%' },
    { field: 'netWeightKG', header: '' },
    { field: 'netWeightL', header: '' },
    { field: 'specificBulkWeight', header: '' },
    { field: 'packWeight', header: '' },
    { field: 'packType', header: '' },    
    { field: 'packWeightUnit', header: '' },
  ]
  allColumnsToDisplay = [...this.columnsToDisplay.map(c => c.field)];
  dataSource: MatTableDataSource<ComponentSapModel> = new MatTableDataSource<ComponentSapModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private componentSapService: ComponentSapService,
    private exportService: ExportService,
    private translate: TranslateService,) { 
    
    this.translate
    .get('dialogService.delete')
    .subscribe((successMessage: string) => {
    });
  }

  ngOnInit(): void {
    this.loadComponents();
  }


  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }
  changeDate() {
    this.loadComponents();
  }

  loadComponents() {
    console.log(this.translate.get('components'));

    this.isLoading = true;
    this.componentSapService.getComponents()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        console.log('components loaded: ', data);
        this.data = data;

        

        this.dataSource = new MatTableDataSource<ComponentSapModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
      })


  }
  exportCSV(visibleDataOnly: boolean) {
    const headerList = ['no', 'id', 'name', 'specificBulkWeight', 'packingWeight', 'lastUpdate'];
    if (visibleDataOnly) {
      // @ts-ignore
      this.exportService.downloadFile(this.dataSource._renderData.value, headerList, 'components');
    } else {
      this.exportService.downloadFile(this.data, headerList, 'components');
    }
  }
}
