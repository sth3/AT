import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { ComponentService } from '../../services/component.service';

import { RecipeModel } from '../../models/recipe.model';
import { OrderModelPacking, selectList, RecalculateOrder } from '../../models/order.model';
import { RecipeService } from 'src/app/services/recipe.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { MatButtonToggleGroup } from '@angular/material/button-toggle';

import { ComponentItemModel } from 'src/app/models/component.model';

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
  volumeComponent: number[] = [];
  quantityComponentPerOrder: number[] = [];
  recipeRecalculate: RecalculateOrder[] = [];
  volumeSum: number = 0;
  quntitySum: number = 0;
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
    selectedRecipe: RecipeModel ,
    selectedorder: OrderModelPacking,
    editMode: boolean
  },
    private componentService: ComponentService) {
    console.log('allRecipes components: ', data.selectedRecipe);
    console.log('allOrder components: ', data.selectedorder);
   // this.dataSource = data.selectedRecipe;
    // this.displayedColumns.length = 24;
    // this.displayedColumns.fill('filler');

    // // The first two columns should be position and name; the last two columns: weight, symbol
    // this.displayedColumns[0] = 'position';
    // this.displayedColumns[1] = 'name';
    // this.displayedColumns[22] = 'weight';
    // this.displayedColumns[23] = 'symbol';
    // this.recipeTest = data.selectedRecipe.components
  }



  ngOnInit(): void {
    this.quantityComponentsPerOrder();
    // this.dataSource = new MatTableDataSource<ComponentItemModel>(this.recipeTest);
  }

  isSticky(buttonToggleGroup: MatButtonToggleGroup, id: string) {
    return (buttonToggleGroup.value || []).indexOf(id) !== -1;
  }
  
  quantityComponentsPerOrder() {
    if (this.data.selectedRecipe == null) {
      return;
    }
    this.quntitySum = 0;
    for (let [index, components] of this.data.selectedRecipe.components.entries()) {
      this.quantityComponentPerOrder[index] = (Number(components.componentSP.toFixed(3)) * (((this.data.selectedorder.quantity / 100))));
      this.quntitySum += Number(this.quantityComponentPerOrder[index].toFixed(3));
    }
    console.log('quantityComponentPerOrder', this.quantityComponentPerOrder);
    console.log('quntitySum', Number(this.quntitySum).toFixed(3));
    this.specificBulkWeight()
  }

  specificBulkWeight() {
    if (this.data.selectedRecipe == null) {
      return;
    }
    this.volumeSum = 0;
    for (let [index, components] of this.data.selectedRecipe.components.entries()) {
      this.volumeComponent[index] = this.quantityComponentPerOrder[index] / Number(components.specificBulkWeight.toFixed(3));
      this.volumeSum += Number(this.volumeComponent[index].toFixed(3));
    }
    console.log('volumeComponent', this.volumeComponent);
    console.log('volumeSum', this.volumeSum);
    this.recalculateDose()
  }

  recalculateDose() {
    this.quantityPallete = Math.ceil(this.volumeSum / Number(this.data.selectedorder.volumePerDose))
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
      // this.quantityBag[index] = Math.floor(this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing);
      // this.quantityADS[index] = (this.quantityComponentPerOrder[index] / this.quantityPallete) - (volumeComponents.packing * this.quantityBag[index]);
      // if (volumeComponents.packingOrder = 1) {
      //   this.quantityBag[index] = 0;
      //   this.quantityADS[index] = 0;
      //   this.quantityBigBag[index] = this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing;
      // }

      switch (this.data.selectedorder.packingOrders[index]) {
        case 0:
          this.quantityBag[index] = Math.floor(this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing);
          this.quantityADS[index] = (this.quantityComponentPerOrder[index] / this.quantityPallete) - (volumeComponents.packing * this.quantityBag[index]);
          break;
        case 1:
          this.quantityBigBag[index] = this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing;
          break;
        case 2:
          this.quantityLiquid[index] = this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing;
          break;
        case 3:
          this.quantityMicro[index] = this.quantityComponentPerOrder[index] / this.quantityPallete / volumeComponents.packing;
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
    console.log('quantityBag', this.quantityBag);
    console.log('quantityADS', this.quantityADS);
    console.log('quantityBigBag', this.quantityBigBag);
    console.log('quantityLiquid', this.quantityLiquid);
    console.log('quantityMicro', this.quantityMicro);


  }

  saveOrder() {
    console.log('this.recipeRecalculate', this.recipeRecalculate);
    return { data: this.recipeRecalculate, edit: true }
  }
  @ViewChild('invoice') invoiceElement!: ElementRef;
  public openPDF(): void {
    html2canvas(this.invoiceElement.nativeElement, { scale: 2 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      const fileWidth = 250;
      const generatedImageHeight = (canvas.height) / canvas.width * fileWidth;
      let PDF = new jsPDF('l', 'mm', 'a4',);
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', 0, 0, fileWidth, generatedImageHeight,);
      PDF.html(this.invoiceElement.nativeElement.innerHTML)
      PDF.save('Orders.pdf');
    });
  }

  





}


