import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ComponentService } from '../../services/component.service';

import { RecipeModel } from '../../models/recipe.model';
import { OrderModelPacking, selectList, RecalculateOrder } from '../../models/order.model';
import { RecipeService } from 'src/app/services/recipe.service';


import { MatButtonToggleGroup } from '@angular/material/button-toggle';

import { ComponentItemModel, ComponentModelSP } from 'src/app/models/component.model';

@Component({
  selector: 'app-recalculate-recipe',
  templateUrl: './recalculate-recipe.component.html',
  styleUrls: ['./recalculate-recipe.component.css']
})
export class RecalculateRecipeComponent implements OnInit {
  quantityPallete: number = 0;
  quantityBag: number[] = [];
  quantityBigBag: number[] = [];
  quantityADS: number[] = [];
  quantityLiquid: number[] = [];
  quantityMicro: number[] = []; 
  quantityComponentPerOrder: number[] = [];
  recipeRecalculate: RecalculateOrder[] = [];  
  doneDose:number [] = [];
  weightPerDose: number = 0;

  packingOrders: selectList[] = [
    { value: 0, viewValue: 'Bag' },
    { value: 1, viewValue: 'Big Bag' },
  ];
  //   dataSource: MatTableDataSource<ComponentItemModel> = new MatTableDataSource<ComponentItemModel>([]);
  //  // new MatTableDataSource(    this.data.selectedRecipe );
  //   displayedColumns: string[] = [];
  //   recipeTest: ComponentItemModel[] = [];

  //   tables = [0];

  

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    recipe: RecipeModel,
    selectedRecipe: RecipeModel,
    selectedorder: OrderModelPacking,
    editMode: boolean
  },
    private componentService: ComponentService) {
    console.log('allRecipes components: ', data.selectedRecipe);
    console.log('allOrder components: ', data.selectedorder);
    
  }



  ngOnInit(): void {
    this.quantityComponents(this.data.selectedRecipe.components);
    // this.dataSource = new MatTableDataSource<ComponentItemModel>(this.recipeTest);
  }

  quantityComponents(components: ComponentItemModel[]) {  
    this.quantityPallete = Math.ceil(components.reduce((acc, comp) => acc + ((comp.componentSP * (this.data.selectedorder.quantity / 100)) / comp.specificBulkWeight), 0) / Number(this.data.selectedorder.volumePerDose));  
    this.quantityComponentPerOrder = components.map((comp) => (comp.componentSP * (this.data.selectedorder.quantity / 100)));
    console.log('quantityComponentPerOrder',this.quantityComponentPerOrder);
    
       this.recalculateDose()
  }

  recalculateDose() {    
   
    this.quantityBag = [];
    this.quantityBigBag = [];
    this.quantityADS = [];
    this.quantityLiquid = [];
    this.quantityMicro = [];
    this.recipeRecalculate = [];
    if (this.data.selectedRecipe == null) {
      return;
    }
    for (let [index, volumeComponents] of this.data.selectedRecipe.components.entries()) {
      this.quantityBigBag[index] = 0;
      this.quantityADS[index] = 0;
      this.quantityBag[index] = 0;
      this.quantityMicro[index] = 0;
      this.quantityLiquid[index] = 0;   
      
      switch (this.data.selectedorder.packingOrders[index].packingType) {
       
        case 0:
          this.quantityBag[index] = Math.floor(this.quantityComponentPerOrder[index] / this.quantityPallete / this.data.selectedorder.packingOrders[index].packingWeight);
          this.quantityADS[index] = (this.quantityComponentPerOrder[index] / this.quantityPallete) - (this.data.selectedorder.packingOrders[index].packingWeight * this.quantityBag[index]);
          break;
        case 1:
          this.quantityBigBag[index] = this.quantityComponentPerOrder[index] / this.quantityPallete ;
          break;
        case 2:
          this.quantityLiquid[index] = this.quantityComponentPerOrder[index] / this.quantityPallete ;
          break;
        case 3:
          this.quantityMicro[index] = this.quantityComponentPerOrder[index] / this.quantityPallete ;
          break;
      }

      
      

      this.recipeRecalculate.push({
        orderNo: this.data.selectedorder.no,
        recipeNo: this.data.selectedorder.recipeNo,
        componentNo: volumeComponents.no,
        quantityDose: this.quantityPallete,
        quantityBag: this.quantityBag[index],
        quantityBigBag: this.quantityBigBag[index],
        quantityADS: this.quantityADS[index],
        quantityLiquid: this.quantityLiquid[index],
        quantityMicro: this.quantityMicro[index],

        
      })

    }


    this.weightPerDose = this.quantityComponentPerOrder.reduce((acc, comp)=>(acc + comp) ) / this.quantityPallete;
    console.log('quantityADS',this.quantityADS.reduce((acc, comp)=>(acc + comp) ) );
    console.log('quantityBigBag',this.quantityBigBag.reduce((acc, comp)=>(acc + comp) ) );
    console.log('quantityLiquid',this.quantityLiquid.reduce((acc, comp)=>(acc + comp) ) );
    console.log('quantityMicro',this.quantityMicro.reduce((acc, comp)=>(acc + comp) ) );

    console.log('quantity',this.quantityComponentPerOrder.reduce((acc, comp)=>acc + (comp)));
    console.log('quantityBag', this.quantityBag);
    console.log('quantityADS', this.quantityADS);
    console.log('quantityBigBag', this.quantityBigBag);
    console.log('quantityLiquid', this.quantityLiquid);
    console.log('quantityMicro', this.quantityMicro);
    this.doneDose[0] = this.recipeRecalculate.reduce((acc,comp)=>acc + comp.quantityBigBag,0) > 0 ? 0 :5;
    this.doneDose[1] = this.recipeRecalculate.reduce((acc,comp)=>acc + comp.quantityLiquid,0) > 0 ? 0 :5;
    this.doneDose[2] = this.recipeRecalculate.reduce((acc,comp)=>acc + comp.quantityADS,0) > 0 ? 0 :5;
    this.doneDose[3] = this.recipeRecalculate.reduce((acc,comp)=>acc + comp.quantityMicro,0) > 0 ? 0 :5;

    console.log('doneDose',this.doneDose);

    

  }

  saveOrder() {
    console.log('this.recipeRecalculate', this.recipeRecalculate);
    return { data: this.recipeRecalculate, edit: true, done:this.doneDose }
  }


 






}


