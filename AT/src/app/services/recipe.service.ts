import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangedRecipeModel, RecipeModel } from '../models/recipe.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { ComponentChangeModel } from '../models/component.model';

interface RecipeResponse {
  active: RecipeModel[];
  archived: ChangedRecipeModel[];
}
@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) {
  }

  getRecipes(): Observable<RecipeModel[]> {
    return this.http.get<RecipeModel[]>(`${environment.apiUrl}/recipes`)
  }

  getAllRecipes(): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>(`${environment.apiUrl}/recipes/all`)
      .pipe(map(response => {
      return {
        active: response.active,
        archived: response.archived
      }
    }));
  }

  updateRecipe(no: number, recipe: RecipeModel) {
    return this.http.put<RecipeModel>(`${environment.apiUrl}/recipes/${no}`, recipe, { withCredentials: true });
  }

  deleteRecipe(no: number) {
    return this.http.delete(`${environment.apiUrl}/recipes/${no}`, { withCredentials: true });
  }

  addRecipe(recipe: RecipeModel): Observable<RecipeModel> {
    return this.http.post<RecipeModel>(`${environment.apiUrl}/recipes`, recipe, { withCredentials: true });
  }

  checkValidity(recipe: RecipeModel): boolean {
    const lastRecipeUpdate = new Date(recipe.lastUpdate);
    return recipe.components.every(component =>
      new Date(component.lastUpdate) <= lastRecipeUpdate);
  }

  getInvalidComponents(recipe: RecipeModel) {
    const lastRecipeUpdate = new Date(recipe.lastUpdate);
    return recipe.components.filter(component => new Date(component.lastUpdate) > lastRecipeUpdate);
  }
  //
  // checkChange(recipes: RecipeModel[]): RecipeModel[] {
  //   console.log('recipes: ', recipes);
  //   recipes.forEach(recipe => {
  //     recipe.isValid = true;
  //     recipe.components.forEach(component => {
  //       const lastRecipeUpdate = new Date(recipe.lastUpdate);
  //       if (new Date(component.lastUpdate) > lastRecipeUpdate) {
  //         console.log('component changed: ', component, recipe);
  //         recipe.isValid = false;
  //         return;
  //       }
  //     })
  //   })
  //   return recipes;
  // }

  getComponentsChangesForRecipe(recipeNo: number): Observable<ComponentChangeModel[]> {
    return this.http.get<ComponentChangeModel[]>(`${environment.apiUrl}/recipes/${recipeNo}/componentsChanges`)
      .pipe(map(changes => {
        return changes.map(change => {
          return {
            ...change,
            changes: change.change.split(', ')
          }
        })
      }));
  }

  getRecipeChanges(recipeNo: number): Observable<ChangedRecipeModel[]> {
    return this.http.get<ChangedRecipeModel[]>(`${environment.apiUrl}/recipes/${recipeNo}/changes`)
      .pipe(map(changes => {
        return changes.map(change => {
          return {
            ...change,
            changes: change.change.split(', ')
          }
        })
      }));
  }
}
