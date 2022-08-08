export interface RecipeModel {
  no: number;
  id: string;
  name: string;
  lastUpdate: string;
  components: ComponentItemModel[];
  isValid?: boolean;
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

export interface ComponentModel {
  no: number;
  id: string;
  name: string;
  lastUpdate: string;
}

export interface ComponentItemModel extends ComponentModel {
  componentSP: number;
}

export interface ChangedComponentModel {
  id: number;
  oldComponent: ComponentModel;
  newComponent: ComponentModel;
  changes: string[];
  user: string;
  date: string;
  change: string;
}
