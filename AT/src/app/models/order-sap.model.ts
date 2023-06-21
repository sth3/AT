


export interface OrderModel {
  recipeRowID: number;
  orderID: string;
  segmentRequirementID: string;
  productID: string;
  productName: string;
  customerName: string;  
  dueDate: string;
  quantity: number;
  unitOfMeasure: string;
  components: ComponentModel;
  timeStampWrite: number;
  timeStampRead: number;
  status: number;  
}

export interface ComponentModel {
  componentRowID: number;
  recipeRowID: string;
  componentID: string;
  nameC: string;
  sp: number;
  specificBulkWeight: number;
  unitOfMeasure: string;
  packingWeight: number;
  packingType: number;

}





