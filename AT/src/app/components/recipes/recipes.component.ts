import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangedRecipeModel, RecipeModel } from '../../models/recipe.model';
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

  archivedData: ChangedRecipeModel[] = [];
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
              this.data = this.data.filter(r => r.no !== data.no);
              this.dataSource.data = this.data;
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
              const recipe = { ...response, ...result };
              console.log('recipe created: ', recipe);
              this.notifierService.showDefaultNotification('New recipe created');
              this.data.push(recipe);
              this.dataSource.data = this.data;
            })
        }
      })
  }

  private loadRecipes() {
    this.isLoading = true;
    this.recipeService.getAllRecipes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((response) => {
        console.log('data: ', response);
        this.data = response.active;
        this.dataSource = new MatTableDataSource<RecipeModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.archivedData = response.archived;
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
              this.data = this.data.map(r => r.no === no ? {...r, ...response} : r);
              this.dataSource.data = this.data;
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

  expandRecipe(element: RecipeModel, event: Event) {
    this.expandedRecipe = this.expandedRecipe === element ? null : element;
    event.stopPropagation();
    console.log('does he need changes? ', this.expandedRecipe);
    if (this.expandedRecipe && !this.expandedRecipe.componentsChanges) {
      console.log('loading changes');
      this.recipeService.getComponentsChangesForRecipe(this.expandedRecipe.no)
        .subscribe(response => {
          if (!response) {
            response = [];
          }
          console.log('changes: ', response);
          this.data = this.data.map(r => r.no === this.expandedRecipe!.no ? {...r, componentsChanges: response} : r);
          this.dataSource.data = this.data;
        })
    }
  }
}
