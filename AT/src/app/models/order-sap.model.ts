
import { UserModel } from './user.model';

export interface OrderSapModel {
  recipeRowID: number;
  orderID: string;
  segmentRequirementID: string;
  productID: string;
  productName: string;
  customerName: string;  
  mixerID: string;  
  mixerName: string;  
  dueDate: string;
  quantity: number;
  unitOfMeasure: string;
  components: ComponentModel[];
  timeStampWrite: number;
  timeStampRead: number;
  status: number;  
  operator: UserModel;
}

export interface ComponentModel {
  componentRowID: number;
  recipeRowID: string;
  componentID: string;
  nameC: string;
  sp: number;
  specificBulkWeight: number;
  unitOfMeasure: string;
  packingWeight: number;
  packingType: number;

}

export interface OrderItemModel extends OrderSapModel {
  mixerID: string;
  package: number;
  mixingTime: number;
  idPackingMachine: number;
  idEmptyingStationBag: number;
  volumePerDose: number;
  operator: UserModel;
  packingOrders: PackingInterfaceModel[];
}

export interface PackingInterfaceModel  {
  packingType: number;
  packingWeight:number
}

export interface RecalculateOrderSapModel {
  orderRowID: number;
  segmentRequirementID: string;
  componentRowID: number;  
  packingType: number;
  packingWeight:number
  quantityDose: number;
  quantityBag: number;
  quantityBigBag: number;
  quantityADS: number;
  quantityLiquid: number;
  quantityMicro: number;  
}

export interface ProductionDoneSapModel  {
  orderRowID: number;   
  done: number;
  BigBagDone: number;
  ADSDone: number;
  LiquidDone: number;
  MicroDone: number;
}

export interface CompliteOrderModel {  
  ADSDone: number;
  BigBagDone: number;  
  LiquidDone: number;
  MicroDone: number;
  done: number;

  idEmptyingStationBag: number;
  mixerID: string;
  mixerName: string;
  idPackingMachine: number;
  mixingTime: number;

  orderID: string;
  orderRowID: number;  
  package: number;
  
  packingOrders: PackingInterfaceModel[];
  productID: string;
  productName: string;
  quantity: number;
  recipeRowID: number;  

  volumePerDose: number;
  //operator: UserModel;
  rec: RecalculateOrderSapModel;
  segmentRequirementID: string;
  componentRowID: number;    
  operatorId: string;
  
 
  
}

export interface CompliteOrdersModel {  
  ADSDone: number;
  BigBagDone: number;  
  LiquidDone: number;
  MicroDone: number;
  done: number;

  idEmptyingStationBag: number;
  mixerID: string;
  mixerName: string;  
  idPackingMachine: number;
  mixingTime: number;

  orderID: string;
  orderRowID: number;  
  package: number;
  
  packingOrders: PackingInterfaceModel[];
  productID: string;
  productName: string;
  quantity: number;
  recipeRowID: number;  

  volumePerDose: number;
  //operator: UserModel;
  rec: RecalculateOrderSapModel;
  segmentRequirementID: string;
  lot: string;
  componentRowID: number;    

  timeStampWrite: number;
 status: number; 

 
  
  
  
  
  customerName: string;  
  dueDate: string;
  
  unitOfMeasure: string;
  components: ComponentModel[];
  
  timeStampRead: number;
  operator: UserModel;
 
  
}





