export interface RecipeModel {
  no: number;
  id: string;
  name: string;
  lastUpdate: string;
  components: ComponentItemModel[];
  isValid?: boolean;
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
