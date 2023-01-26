export interface ComponentModel {
  no: number;
  id: string;
  name: string;
  packing:number;
  packingOrder:number;
  specificBulkWeight:number;
  lastUpdate: string;
}

export interface ComponentItemModel extends ComponentModel {
  componentSP: number;
}

export interface ComponentChangeModel {
  id: number;
  oldComponent: ComponentModel;
  newComponent: ComponentModel;
  changes: string[];
  user: string;
  date: string;
  change: string;
}
