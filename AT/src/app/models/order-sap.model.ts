
import { UserModel } from './user.model';

export interface OrderModel {
  recipeRowID: number;
  orderID: string;
  segmentRequirementID: string;
  productID: string;
  productName: string;
  customerName: string;  
  dueDate: string;
  quantity: number;
  unitOfMeasure: string;
  components: ComponentModel[];
  timeStampWrite: number;
  timeStampRead: number;
  status: number;  
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

export interface OrderItemModel extends OrderModel {
  idMixer: number;
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
  idMixer: number;
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

  
  
  
  
}



