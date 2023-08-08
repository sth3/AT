import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  OrderItemModel,
  ComponentModel,
  RecalculateOrderSapModel,
  ProductionDoneSapModel,
} from '../../models/order-sap.model';
@Component({
  selector: 'app-recalculate-sap',
  templateUrl: './recalculate-sap.component.html',
  styleUrls: ['./recalculate-sap.component.css'],
})
export class RecalculateSapComponent implements OnInit {
  quantityPallete: number = 0;
  volumePerDoseTank: number = 0;
  weightPerDose: number = 0;
  quantityBag: number[] = [];
  quantityBigBag: number[] = [];
  quantityADS: number[] = [];
  quantityLiquid: number[] = [];
  quantityMicro: number[] = [];
  recipeRecalculate: RecalculateOrderSapModel[] = [];
  doneDose: ProductionDoneSapModel = {
    orderRowID: 0,
    done: 0,
    BigBagDone: 0,
    LiquidDone: 0,
    ADSDone: 0,
    MicroDone: 0,
  };
  quantityComponentPerOrder: number[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      orderSap: OrderItemModel;
      orderSapComponents: ComponentModel[];
      dueDate: string;
    }
  ) {}

  ngOnInit(): void {
    this.quantityComponents(this.data.orderSapComponents);
  }

  quantityComponents(components: ComponentModel[]) {
    this.quantityPallete = Math.ceil(
      components.reduce(
        (acc, comp) => acc + comp.sp / comp.specificBulkWeight,
        0
      ) / Number(this.data.orderSap.volumePerDose)
    );
    //console.log("🚀 ~ file: recalculate-sap.component.ts:24 ~ RecalculateSapComponent ~ quantityComponents ~ this.quantityPallete :", this.quantityPallete )
    this.volumePerDoseTank = Math.ceil(
      components.reduce(
        (acc, comp) => acc + comp.sp / comp.specificBulkWeight,
        0
      ) / this.quantityPallete
    );
    //console.log("🚀 ~ file: recalculate-sap.component.ts:26 ~ RecalculateSapComponent ~ quantityComponents ~ this.volumePerDoseTank:", this.volumePerDoseTank)
    this.quantityComponentPerOrder = components.map((comp) => comp.sp);
    this.recalculateDose();
  }

  recalculateDose() {
    this.quantityBag = [];
    this.quantityBigBag = [];
    this.quantityADS = [];
    this.quantityLiquid = [];
    this.quantityMicro = [];
    this.recipeRecalculate = [];
    if (this.data.orderSapComponents == null) {
      return;
    }
    if (this.data.orderSap == null) {
      return;
    }
    for (let [
      index,
      volumeComponents,
    ] of this.data.orderSapComponents.entries()) {
      this.quantityBigBag[index] = 0;
      this.quantityADS[index] = 0;
      this.quantityBag[index] = 0;
      this.quantityMicro[index] = 0;
      this.quantityLiquid[index] = 0;

      switch (this.data.orderSap.packingOrders[index].packingType) {
        case 0:
          this.quantityBag[index] = Math.floor(
            this.data.orderSapComponents[index].sp /
              this.quantityPallete /
              this.data.orderSap.packingOrders[index].packingWeight
          );
          this.quantityADS[index] =
            this.data.orderSapComponents[index].sp / this.quantityPallete -
            this.data.orderSap.packingOrders[index].packingWeight *
              this.quantityBag[index];
          break;
        case 1:
          this.quantityBigBag[index] =
            this.data.orderSapComponents[index].sp / this.quantityPallete;
          break;
        case 2:
          this.quantityLiquid[index] =
            this.data.orderSapComponents[index].sp / this.quantityPallete;
          break;
        case 3:
          this.quantityMicro[index] =
            this.data.orderSapComponents[index].sp / this.quantityPallete;
          break;
      }

      this.recipeRecalculate.push({
        orderRowID: this.data.orderSap.recipeRowID,
        segmentRequirementID: this.data.orderSap.segmentRequirementID,
        componentRowID: volumeComponents.componentRowID,
        packingType: this.data.orderSap.packingOrders[index].packingType,
        packingWeight: this.data.orderSap.packingOrders[index].packingWeight,
        quantityDose: this.quantityPallete,
        quantityBag: this.quantityBag[index],
        quantityBigBag: this.quantityBigBag[index],
        quantityADS: this.quantityADS[index],
        quantityLiquid: this.quantityLiquid[index],
        quantityMicro: this.quantityMicro[index],
      });
    }

    this.weightPerDose =
      this.quantityComponentPerOrder.reduce((acc, comp) => acc + comp) /
      this.quantityPallete;

    this.doneDose.orderRowID = this.data.orderSap.recipeRowID;

    this.doneDose.BigBagDone =
      this.recipeRecalculate.reduce(
        (acc, comp) => acc + comp.quantityBigBag,0) > 0
        ? 0
        : 5;

    this.doneDose.LiquidDone =
      this.recipeRecalculate.reduce(
        (acc, comp) => acc + comp.quantityLiquid,0) > 0
        ? 0
        : 5;

    this.doneDose.ADSDone =
      this.recipeRecalculate.reduce((acc, comp) => acc + comp.quantityADS, 0) > 0
        ? 0
        : 5;
        
    this.doneDose.MicroDone =
      this.recipeRecalculate.reduce((acc, comp) => acc + comp.quantityMicro,0) > 0
        ? 0
        : 5;

    console.log('doneDose', this.doneDose);
  }

  saveOrder() {
    return { data: this.recipeRecalculate, edit: true, done: this.doneDose };
  }
}
