export interface RecipeModel {
  no: number;
  id: string;
  name: string;
  lastUpdate: string;
  components?: ComponentItemModel[]
}

export interface ComponentItemModel {
  id: string;
  name: string;
  componentSP: number;
}

export interface ComponentModel {
  no: number;
  id: string;
  name: string;
  lastUpdate: string;
}
