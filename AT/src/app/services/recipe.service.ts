import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangedRecipeModel, RecipeModel } from '../models/recipe.model';
import { environment } from '../../environments/environment';

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
    // .pipe(map(response => {
    //   return response.map(recipe => {
    //     return {
    //       id: recipe.id,
    //       no: recipe.no,
    //       name: recipe.name,
    //       components: this.getComponents(recipe)
    //     }
    //   })
    // }));
  }

  getAllRecipes(): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>(`${environment.apiUrl}/recipes/all`);
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
}
