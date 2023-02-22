import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangedRecipeModel, RecipeModel } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { DialogService } from '../../services/dialog.service';
import { EditRecipeDialogComponent } from '../edit-recipe-dialog/edit-recipe-dialog.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { finalize } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportService } from '../../services/export.service';
import { NotifierService } from '../../services/notifier.service';

import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserModel, UserRole } from '../../models/user.model';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class RecipesComponent implements OnInit {
  archivedData: ChangedRecipeModel[] = [];
  data: RecipeModel[] = [];
  quickFilter: string = '';
  currentUser!: UserModel;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  columnsToDisplay = [
    { field: 'no', header: 'No' },
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Recipe name' },
    { field: 'lastUpdate', header: 'Last update', width: '20%' },
  ];
  isLoading = true;
  columnsToDisplayWithExpand = [
    'expand',
    ...this.columnsToDisplay.map((c) => c.field),
    'actions',
  ];
  expandedRecipe: RecipeModel | null = null;
  dataSource: MatTableDataSource<RecipeModel> =
    new MatTableDataSource<RecipeModel>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private recipeService: RecipeService,
    private dialogService: DialogService,
    private exportService: ExportService,
    private notifierService: NotifierService,
    private authService: AuthService,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.loadRecipes();
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }

  onDeleteClick(data: any) {
    this.translate.get('dialogService').subscribe((successMessage) => {
      this.dialogService
        .confirmDialog(successMessage.dialogRecipeDelete)
        .subscribe((result) => {
          if (result) {
            this.recipeService.deleteRecipe(data.no).subscribe(() => {
              console.log('recipe deleted: ', data);
              this.notifierService.showDefaultNotification(
                successMessage.notifierRecipeDeleted
              );
              this.data = this.data.filter((r) => r.no !== data.no);
              this.dataSource.data = this.data;
            });
          }
        });
    });
  }

  onEditClick(data: any) {
    console.log(data);
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (this.currentUser !== null) {
        if (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'TECHNOLOG') {
          this.dialogService
            .customDialog(
              EditRecipeDialogComponent,
              { recipe: data, allRecipes: this.data, editMode: true },
              { width: '700px', height: '700px' }
            )
            .subscribe((result) => {
              if (result) {
                this.promptSave(data.no, result);
              }
            });
        } else {
          this.authService.promptLogin('Login');
          return;
        }
      } else {
        this.authService.promptLogin('Login');
        return;
      }
    })
  }

  createRecipe() {
    this.authService.getCurrentUser().subscribe(data => {
      this.currentUser = data;
      if (this.currentUser !== null) {
        if (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'TECHNOLOG') {
          this.dialogService
            .customDialog(
              EditRecipeDialogComponent,
              { recipe: null, allRecipes: this.data, editMode: false },
              { width: '700px', height: '700px' }
            )
            .subscribe((result) => {
              if (result) {
                console.log('result', result);
                this.translate.get('dialogService').subscribe((successMessage) => {
                  this.recipeService.addRecipe(result).subscribe((response) => {
                    const recipe = { ...response, ...result };
                    console.log('recipe created: ', recipe);
                    this.notifierService.showDefaultNotification(
                      successMessage.notifierRecipeCreated
                    );
                    this.data.push(recipe);
                    this.dataSource.data = this.data;
                    console.log('this.dataSource.data: ', this.dataSource.data);
                  });
                });
              }
            });
        } else {
          this.authService.promptLogin('Login');
          return;
        }
      } else {
        this.authService.promptLogin('Login');
        return;
      }
    })
  }

  loadRecipes() {
    this.isLoading = true;
    this.recipeService
      .getAllRecipes()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        console.log('data: ', response);
        this.data = response.active;

        if (this.range.value.start !== null && this.range.value.end !== null) {
          this.data = response.active.filter((item: RecipeModel) => {
            // console.log('new Date(item.datetime)',new Date(item.datetime));
            // console.log('range start', this.range.value.start);
            return (
              new Date(item.lastUpdate) >= this.range.value.start &&
              new Date(item.lastUpdate) <= this.range.value.end
            );
          });
        } else if (this.range.value.start !== null) {
          this.data = response.active.filter((item: RecipeModel) => {
            return new Date(item.lastUpdate) >= this.range.value.start;
          });
        } else if (this.range.value.end !== null) {
          this.data = response.active.filter((item: RecipeModel) => {
            return new Date(item.lastUpdate) <= this.range.value.end;
          });
        }
        this.dataSource = new MatTableDataSource<RecipeModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.archivedData = response.archived;
      });
  }

  private promptSave(no: number, data: any) {
    this.translate.get('dialogService').subscribe((successMessage) => {
      this.dialogService
        .confirmDialog(successMessage.dialogRecipeCreate)
        .subscribe((result) => {
          if (result) {
            this.recipeService.updateRecipe(no, data).subscribe((response) => {
              console.log('recipe updated: ', response);
              this.notifierService.showDefaultNotification(successMessage.notifierRecipeUpdate);
              this.data = this.data.map((r) =>
                r.no === no ? { ...r, ...response } : r
              );
              this.dataSource.data = this.data;
            });
          }
        });
    });
  }

  getInvalidComponents(element: RecipeModel) {
    return this.recipeService.getInvalidComponents(element);
  }

  exportCSV(visibleDataOnly: boolean) {
    const headerList = this.exportService.getRecipesHeaders();
    let data;
    if (visibleDataOnly) {
      // @ts-ignore
      data = this.exportService.convertRecipesForDownload(this.dataSource._renderData.value
      );
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
      this.recipeService
        .getComponentsChangesForRecipe(this.expandedRecipe.no)
        .subscribe((response) => {
          if (!response) {
            response = [];
          }
          console.log('changes: ', response);
          this.data = this.data.map((r) =>
            r.no === this.expandedRecipe!.no
              ? { ...r, componentsChanges: response }
              : r
          );
          this.dataSource.data = this.data;
          this.expandedRecipe = this.data.find(
            (r) => r.no === this.expandedRecipe!.no
          )!;
        });
    }
  }
}
