import { ColDef } from 'ag-grid-community';

export const recipesTableDefaultColDef: ColDef = {
  filter: 'agTextColumnFilter',
  sortable: true,
  width: 100,
  resizable: true,
}

export const recipesTableColDef: ColDef[] = [
  { field: 'no', headerName: 'Number' },
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Recipe name' }
]
