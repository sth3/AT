import { Component, OnInit } from '@angular/core';
import { recipesTableColDef, recipesTableDefaultColDef } from './recipes-table.config';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { RecipeModel } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  colDefs: ColDef[];
  defaultColDef: ColDef;
  data: RecipeModel[] = [];
  gridApi!: GridApi;

  constructor(private recipeService: RecipeService) {
    this.defaultColDef = recipesTableDefaultColDef;
    this.colDefs = recipesTableColDef;
  }

  ngOnInit(): void {
    this.recipeService.getRecipes()
      .subscribe(response => {
        console.log('data: ', response);
        this.data = response.data;
        if (this.gridApi) {
          this.setData();
        }
      })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    if (this.data.length) {
      this.setData();
    }
  }

  setData() {
    this.gridApi.setRowData(this.data);
  }

}
