import { RecipeModel } from './recipe.model';
import { UserModel } from './user.model';

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
  operator: UserModel;
}

export interface OrderListModel {
  no: number;
  id: string;
  name: string;
}
