import { Component, OnInit } from '@angular/core';
import { ComponentService } from '../../services/component.service';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ComponentModel} from '../../models/recipe.model';
import { componentsTableColDef, componentsTableDefaultColDef } from './components-table.config';
import { ButtonsRendererComponent } from '../buttons-renderer/buttons-renderer.component';
import { DialogService } from '../../services/dialog.service';
import { EditComponentDialogComponent } from '../edit-component-dialog/edit-component-dialog.component';

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {

  colDefs: ColDef[];
  defaultColDef: ColDef;
  data: ComponentModel[] = [];
  gridApi!: GridApi;
  quickFilter: string = '';

  constructor(private componentService: ComponentService,
              private dialogService: DialogService) {
    this.defaultColDef = componentsTableDefaultColDef;
    this.colDefs = componentsTableColDef;
    this.colDefs.push(this.getButtonsColDef());
  }

  ngOnInit(): void {
    this.componentService.getComponents()
      .subscribe(data => {
        console.log('components loaded: ', data);
        this.data = data;
        if (this.gridApi) {
          this.setData();
        }
      })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    if (this.data.length) {
      this.setData();
    }

  }

  setData() {
    this.gridApi.setRowData(this.data);
  }

  getButtonsColDef(): ColDef {
    return {
      headerName: 'Actions',
      cellRenderer: ButtonsRendererComponent,
      cellRendererParams: {
        onDelete: this.onDeleteClick.bind(this),
        onEdit: this.onEditClick.bind(this)
      }
    }
  }

  // todo - add delete/edit confirmation
  onDeleteClick(e: any) {
    this.dialogService.confirmDialog('Are you sure you want to delete this component?')
      .subscribe(result => {
        if (result) {
          console.log('delete clicked: ', e);
          const data = e.rowData;
          this.componentService.deleteComponent(data.id)
            .subscribe(response => {
              console.log('component deleted: ', response);
              this.data.splice(this.data.findIndex(c => c.id === data.id), 1);
              this.setData();
            })
        }
      })
  }

  onEditClick(e: any) {
    const data = e.rowData;
    this.dialogService.customDialog(EditComponentDialogComponent,
      { component: e.rowData, allComponents: this.data })
      .subscribe(result => {
        if (result) {
          console.log('edit clicked: ', e, result);
          this.componentService.updateComponent(data.id, result)
            .subscribe(response => {
              console.log('component updated: ', response);
              this.data[this.data.findIndex(c => c.id === response.id)] = response;
              this.setData();
            })
        }
      })
  }

  changeFilter() {
    this.gridApi.setQuickFilter(this.quickFilter);
  }
}
