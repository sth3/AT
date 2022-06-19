import { RecipeModel } from './recipe.model';

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
  createdAt: string;
  lastUpdate: string;
  completedAt: string | null;
  operatorId: string;
  operatorName: string;
}
