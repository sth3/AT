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
  mixingTime: number;
  idPackingMachine: number;
  idEmptyingStationBag: number;
  volumePerDose: number;
  recipeNo:number;
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

export interface OrderPacking{
  packingOrder: number[];
  recipeNo: number;
  orderNo: number ;
  componentNo:number[]; }

  export interface OrderModelPacking {
    no: number;
    id: string;
    name: string;
    customerName: string;
    dueDate: string;
    recipe: RecipeModel;
    quantity: number;
    idMixer: number;
    mixingTime: number;
    idPackingMachine: number;
    idEmptyingStationBag: number;
    volumePerDose: number;
    recipeNo:number;
    createdAt: string;
    lastUpdate: string;
    completedAt: string | null;
    operator: UserModel;
    packing: OrderPacking;
  }

