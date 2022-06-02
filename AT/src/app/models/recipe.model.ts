export interface RecipeModel {
  no: number;
  id: string;
  name: string;
  components: ComponentModel[]
}

export interface ComponentModel {
  id: number;
  componentName: string;
  componentSP: number;
}

export interface RecipeResponse {
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
  data: RecipeModel[];
}
