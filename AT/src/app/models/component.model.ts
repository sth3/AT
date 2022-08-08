export interface ComponentModel {
  no: number;
  id: string;
  name: string;
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