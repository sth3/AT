import { ComponentChangeModel, ComponentItemModel } from './component.model';

export interface RecipeModel {
  no: number;
  id: string;
  name: string;
  lastUpdate: string;
  components: ComponentItemModel[];
  isValid?: boolean;
  componentsChanges?: ComponentChangeModel[];
}

export interface ChangedRecipeModel {
  id: number;
  oldRecipe: RecipeModel;
  newRecipe: RecipeModel;
  changes: string[];
  change: string;
  user: string;
  date: string;
}
