import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecipeModel } from '../models/recipe.model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) {
  }

  getRecipes(): Observable<RecipeModel[]> {
    return this.http.get<RecipeModel[]>(`${environment.apiUrl}/recipes`)
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            isValid: this.checkValidity(recipe)
          }
        })
      }));
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
