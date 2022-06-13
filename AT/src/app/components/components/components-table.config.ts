import { ColDef } from 'ag-grid-community';

export const componentsTableDefaultColDef: ColDef = {
  filter: 'agTextColumnFilter',
  sortable: true,
  width: 100,
  resizable: true,
}

export const componentsTableColDef: ColDef[] = [
  { field: 'no', headerName: 'Number' },
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Component name' },
  { field: 'lastUpdate', headerName: 'Last update', filter: 'agDateColumnFilter', },
]
