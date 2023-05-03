import { RecipeModel } from './recipe.model';
import { UserModel } from './user.model';
import { ComponentItemModel } from './component.model';


export interface OrderModel {
  no: number;
  id: string;
  name: string;
  customerName: string;
  dueDate: string;
  recipe: RecipeModel;
  quantity: number;
  idMixer: number;
  package: number;
  mixingTime: number;
  idPackingMachine: number;
  idEmptyingStationBag: number;
  volumePerDose: number;
  recipeNo: number;
  createdAt: string;
  lastUpdate: string;
  completedAt: string | null;
  operator: UserModel;
}

export interface OrderListModel {
  no: number;
  id: string;
  name: string;
}

export interface OrderPacking {
  packingOrder: number[];
  recipeNo: number;
  orderNo: number;
  componentNo: number[];
}


export interface RecalculateOrder {
  orderNo: number;
  recipeNo: number;
  componentNo: number;
  quantityDose: number;
  quantityBag: number;
  quantityBigBag: number;
  quantityADS: number;
  quantityLiquid: number;
  quantityMicro: number;
}

export interface OrderModelPacking {
  no: number;
  id: string;
  name: string;
  customerName: string;
  dueDate: string;
  recipe: RecipeModel;
  quantity: number;
  idMixer: number;
  package: number;
  mixingTime: number;
  idPackingMachine: number;
  idEmptyingStationBag: number;
  volumePerDose: number;
  recipeNo: number;
  createdAt: string;
  lastUpdate: string;
  completedAt: string | null;
  operator: UserModel;
  packingOrders: PackingInterface[];
  packing: OrderPacking;
  doses: RecalculateOrder;
  BigBagDone: number;
  ADSDone: number;
  LiquidDone: number;
  MicroDone: number;
 
}

export interface selectList {
  value: number;
  viewValue: string;
}

export interface PackingInterface  {
  packingType: number;
  packingWeight:number
}



