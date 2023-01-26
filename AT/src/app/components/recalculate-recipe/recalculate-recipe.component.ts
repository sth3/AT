import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ComponentService } from '../../services/component.service';

import { RecipeModel } from '../../models/recipe.model';
import { OrderListModel, OrderModel } from '../../models/order.model';
@Component({
  selector: 'app-recalculate-recipe',
  templateUrl: './recalculate-recipe.component.html',
  styleUrls: ['./recalculate-recipe.component.css']
})
export class RecalculateRecipeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    recipe: RecipeModel,
    selectedRecipe: RecipeModel | undefined,
    selectedorder: OrderListModel[];
    editMode: boolean
  },
  private componentService: ComponentService) {
    console.log('allRecipes components: ', data.selectedRecipe);
    console.log('allOrder components: ', data.selectedorder);
   }

  ngOnInit(): void {
  }

}
