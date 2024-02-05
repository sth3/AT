export interface ComponentModel {
  no: number;
  id: string;
  name: string;  
  packingType:number;
  packingWeight:number;
  specificBulkWeight:number;
  lastUpdate: string;
}
export interface ComponentSapModel {
  rowID: number;
  materialID: string;
  materialName: string;  
  netWeightKG:number;
  netWeightL:number;
  specificBulkWeight:number;
  packWeight:number;
  packType:string;
  packWeightUnit: string;
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



