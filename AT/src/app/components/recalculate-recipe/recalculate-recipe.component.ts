import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ComponentService } from '../../services/component.service';

import { RecipeModel } from '../../models/recipe.model';
import { OrderModelPacking, selectList, RecalculateOrder } from '../../models/order.model';
import { RecipeService } from 'src/app/services/recipe.service';
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
  volumeComponent: number[] = [];
  quantityComponentPerOrder: number[] = [];
  //recipeRecalculate: RecalculateOrder[]  = [];
  volumeSum: number = 0;
  quntitySum: number = 0;
  packingOrders: selectList[] = [
    { value: 0, viewValue: 'Bag' },
    { value: 1, viewValue: 'Big Bag' },
  ];


  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    recipe: RecipeModel,
    selectedRecipe: RecipeModel | undefined,
    selectedorder: OrderModelPacking,
    editMode: boolean,
    recipeRecalculate : RecalculateOrder[]        
  },
    private componentService: ComponentService) {
    console.log('allRecipes components: ', data.selectedRecipe);
    console.log('allOrder components: ', data.selectedorder);
    this.data.recipeRecalculate
    
  }

  ngOnInit(): void {
    this.quantityComponentsPerOrder();
    
  }
  quantityComponentsPerOrder() {
    if (this.data.selectedorder.recipe == null) {
      return;
    }
    this.quntitySum = 0;
    for (let [index, components] of this.data.selectedorder.recipe.components.entries()) {
      this.quantityComponentPerOrder[index] = (Number(components.componentSP.toFixed(3)  ) * (  ((this.data.selectedorder.quantity/100)  ))) ;
      this.quntitySum += Number(this.quantityComponentPerOrder[index].toFixed(3));
    }
    console.log('quantityComponentPerOrder', this.quantityComponentPerOrder);
    console.log('quntitySum', Number(this.quntitySum).toFixed(3));
    this.specificBulkWeight()
  }

  specificBulkWeight() {
    if (this.data.selectedorder.recipe == null) {
      return;
    }
    this.volumeSum = 0;
    for (let [index, components] of this.data.selectedorder.recipe.components.entries()) {
      this.volumeComponent[index] = this.quantityComponentPerOrder[index] / Number(components.specificBulkWeight.toFixed(3));
      this.volumeSum += Number(this.volumeComponent[index].toFixed(3));
    }
    console.log('volumeComponent', this.volumeComponent);
    console.log('volumeSum', this.volumeSum);
    this.recalculateDose()
  }

  recalculateDose(){
    this.quantityPallete = Math.ceil(this.volumeSum / Number(this.data.selectedorder.volumePerDose))
    this.quantityBag = [];
    this.quantityBigBag = [];
    this.quantityADS = [];
    this.quantityLiquid = [];
    this.data.recipeRecalculate = [];
    for (let [index, volumeComponents] of this.data.selectedorder.recipe.components.entries()) {
      this.quantityBigBag[index] = 0; 
      this.quantityADS[index] = 0; 
      this.quantityLiquid[index] = 0; 
      this.quantityBag[index] = Math.floor(this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing) ;  
      this.quantityADS[index] = (this.quantityComponentPerOrder[index] / this.quantityPallete ) - (volumeComponents.packing * this.quantityBag[index]);     
      if(volumeComponents.packingOrder){
        this.quantityBag[index] = 0;  
        this.quantityADS[index] = 0; 
        this.quantityBigBag[index] = this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing ;      
      }
      this.data.recipeRecalculate.push({
        orderNo : this.data.selectedorder.no, 
        recipeNo:this.data.selectedorder.recipeNo, 
        componentNo: volumeComponents.no, 
        quantityDose:this.quantityPallete,
        quantityBag:this.quantityBag[index], 
        quantityBigBag:this.quantityBigBag[index], 
        quantityADS:this.quantityADS[index], 
        quantityLiquid:this.quantityLiquid[index]      
      })

    }

  }

  saveOrder(){
    console.log('this.recipeRecalculate',this.data.recipeRecalculate);
    return {data: this.data.recipeRecalculate ,edit: true}
}
  
  
}
