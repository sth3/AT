import { ColDef } from 'ag-grid-community';

export const componentsTableDefaultColDef: ColDef = {
  filter: 'agTextColumnFilter',
  sortable: true,
  width: 100,
  resizable: true,
}

export const componentsTableColDef: ColDef[] = [
  { field: 'No', headerName: 'Number' },
  { field: 'ID', headerName: 'ID' },
  { field: 'NAME', headerName: 'Component NAME' },
]
