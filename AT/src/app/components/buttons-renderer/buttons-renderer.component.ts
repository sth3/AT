import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

interface ButtonsRenderParams extends ICellRendererParams{
  onDelete: (e: any) => void;
  onEdit: (e: any) => void;
}

@Component({
  selector: 'app-buttons-renderer',
  template: `
    <button mat-icon-button color="primary" aria-label="Edit item" (click)="edit($event)">
      <mat-icon>edit</mat-icon>
    </button>
    <button mat-icon-button color="danger" aria-label="Delete item" (click)="delete($event)">
      <mat-icon>delete_forever</mat-icon>
    </button>
  `,
})
export class ButtonsRendererComponent implements ICellRendererAngularComp {

  // @ts-ignore
  params: ButtonsRenderParams;

  constructor() {
  }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  edit($event: MouseEvent) {
    const params = {
      event: $event,
      rowData: this.params.node.data
    }
    this.params.onEdit(params);
  }

  delete($event: MouseEvent) {
    const params = {
      event: $event,
      rowData: this.params.node.data
    }
    this.params.onDelete(params);
  }
}
