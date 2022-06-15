import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeModel } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { DialogService } from '../../services/dialog.service';
import { EditRecipeDialogComponent } from '../edit-recipe-dialog/edit-recipe-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { finalize } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportService } from '../../services/export.service';
import { NotifierService } from '../../services/notifier.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RecipesComponent implements OnInit {

  data: RecipeModel[] = [];
  quickFilter: string = '';
  columnsToDisplay = [
    { field: 'no', header: 'No' },
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Recipe name' },
    { field: 'lastUpdate', header: 'Last update', width: '20%' },
  ];
  isLoading = true;
  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay.map(c => c.field), 'actions'];
  expandedRecipe: RecipeModel | null = null;
  dataSource: MatTableDataSource<RecipeModel> = new MatTableDataSource<RecipeModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private recipeService: RecipeService,
              private dialogService: DialogService,
              private exportService: ExportService,
              private notifierService: NotifierService) {
  }

  ngOnInit(): void {
    this.loadRecipes();
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  onDeleteClick(data: any) {
    this.dialogService.confirmDialog('Are you sure you want to delete this recipe?')
      .subscribe(result => {
        if (result) {
          this.recipeService.deleteRecipe(data.no)
            .subscribe(() => {
              console.log('recipe deleted: ', data);
              this.notifierService.showDefaultNotification('Recipe deleted');
              this.loadRecipes();
            })
        }
      })
  }

  onEditClick(data: any) {
    this.dialogService.customDialog(EditRecipeDialogComponent,
      { recipe: data, allRecipes: this.data, editMode: true },
      { width: '700px', height: '700px' })
      .subscribe(result => {
        if (result) {
          this.promptSave(data.no, result);
        }
      })
  }

  createRecipe() {
    this.dialogService.customDialog(EditRecipeDialogComponent,
      { recipe: null, allRecipes: this.data, editMode: false },
      { width: '700px', height: '700px' })
      .subscribe(result => {
        if (result) {
          this.recipeService.addRecipe(result)
            .subscribe(response => {
              console.log('recipe created: ', response);
              this.notifierService.showDefaultNotification('New recipe created');
              this.loadRecipes();
            })
        }
      })
  }

  private loadRecipes() {
    this.isLoading = true;
    this.recipeService.getRecipes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((response: RecipeModel[]) => {
        console.log('data: ', response);
        this.data = response;
        this.dataSource = new MatTableDataSource<RecipeModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  private promptSave(no: number, data: any) {
    this.dialogService.confirmDialog('Are you sure you want to save this recipe?')
      .subscribe(result => {
        if (result) {
          this.recipeService.updateRecipe(no, data)
            .subscribe(response => {
              console.log('recipe updated: ', response);
              this.notifierService.showDefaultNotification('Recipe updated');
              this.loadRecipes();
            })
        }
      })
  }

  getInvalidComponents(element: RecipeModel) {
    return this.recipeService.getInvalidComponents(element)
  }

  exportCSV(visibleDataOnly: boolean) {
    const headerList = this.exportService.getRecipesHeaders();
    let data;
    if (visibleDataOnly) {
      // @ts-ignore
      data = this.exportService.convertRecipesForDownload(this.dataSource._renderData.value);
    } else {
      data = this.exportService.convertRecipesForDownload(this.data);
    }
    this.exportService.downloadFile(data, headerList, 'recipes');
  }
}
