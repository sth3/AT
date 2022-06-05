import { Component, OnInit } from '@angular/core';
import { recipesTableColDef, recipesTableDefaultColDef } from './recipes-table.config';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { RecipeModel } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { ButtonsRendererComponent } from '../buttons-renderer/buttons-renderer.component';
import { DialogService } from '../../services/dialog.service';
import { EditRecipeDialogComponent } from '../edit-recipe-dialog/edit-recipe-dialog.component';

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
  quickFilter: string = '';

  constructor(private recipeService: RecipeService,
              private dialogService: DialogService) {
    this.defaultColDef = recipesTableDefaultColDef;
    this.colDefs = [...recipesTableColDef, this.getButtonsColDef()];
  }

  ngOnInit(): void {
    this.recipeService.getRecipes()
      .subscribe(response => {
        console.log('data: ', response);
        this.data = response;
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

  changeFilter() {
    this.gridApi.setQuickFilter(this.quickFilter);
  }

  getButtonsColDef(): ColDef {
    return {
      headerName: 'Actions',
      cellRenderer: ButtonsRendererComponent,
      cellRendererParams: {
        onDelete: this.onDeleteClick.bind(this),
        onEdit: this.onEditClick.bind(this)
      }
    }
  }

  onDeleteClick(e: any) {
    this.dialogService.confirmDialog('Are you sure you want to delete this recipe?')
      .subscribe(result => {
        if (result) {
          console.log('delete clicked: ', e);
          const data = e.rowData;
          this.recipeService.deleteRecipe(data.id)
            .subscribe(response => {
              console.log('recipe deleted: ', response);
              this.data.splice(this.data.findIndex(c => c.id === data.id), 1);
              this.setData();
            })
        }
      })
  }

  onEditClick(e: any) {
    const data = e.rowData;
    this.dialogService.customDialog(EditRecipeDialogComponent,
      { recipe: e.rowData, allRecipes: this.data, editMode: true })
      .subscribe(result => {
        if (result) {
          console.log('edit clicked: ', e, result);
          this.recipeService.updateRecipe(data.id, result)
            .subscribe(response => {
              console.log('recipe updated: ', response);
              this.data[this.data.findIndex(c => c.no === response.no)] = response;
              this.setData();
            })
        }
      })
  }

  createRecipe() {
    this.dialogService.customDialog(EditRecipeDialogComponent,
      { recipe: null, allRecipes: this.data, editMode: false })
      .subscribe(result => {
        if (result) {
          console.log('create clicked: ', result);
          this.recipeService.addRecipe(result)
            .subscribe(response => {
              console.log('recipe created: ', response);
              this.data.push(response);
              this.setData();
            })
        }
      })
  }
}
