export interface RecipeModel {
  no: number;
  id: string;
  name: string;
  components?: ComponentItemModel[]
}

export interface ComponentItemModel {
  id: number;
  componentName: string;
  componentSP: number;
}

export interface ComponentModel {
  no: number;
  id: string;
  name: string;
}

export interface RecipeResponse {
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  data: RecipeModel[];
}
