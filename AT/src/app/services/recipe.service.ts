import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComponentItemModel, ComponentModel, RecipeModel, RecipeResponse } from '../models/recipe.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<RecipeModel[]> {
    return this.http.get<RecipeModel[]>(`${environment.apiUrl}/recipes`)
      .pipe(map(response => {
        return response.map(recipe => {
          return {
            id: recipe.id,
            no: recipe.no,
            name: recipe.name,
            components: this.getComponents(recipe)
          }
        })
      }));
  }

  updateRecipe(id: string, recipe: RecipeModel) {
    return this.http.put<RecipeModel>(`${environment.apiUrl}/recipes/${id}`, this.prepareRequest(recipe));
  }

  deleteRecipe(id: string) {
    return this.http.delete(`${environment.apiUrl}/recipes/${id}`);
  }

  addRecipe(recipe: RecipeModel): Observable<RecipeModel> {
    return this.http.post<RecipeModel>(`${environment.apiUrl}/recipes`, this.prepareRequest(recipe));
  }

  private getComponents(recipe: any) {
    const arr: ComponentItemModel[] = [];
    Object.keys(recipe)
      .filter(key => key.startsWith('componentName'))
      .forEach(key => {
        const index = key.substring(13);
        arr.push({
          id: +index,
          componentName: recipe[`componentName${index}`],
          componentSP: recipe[`componentSP${index}`]
        })
      })
    return arr;
  }

  private prepareRequest(recipe: RecipeModel) {
    const obj: any = {
      no: recipe.no,
      name: recipe.name
    }
    recipe.components?.forEach(component => {
      obj[`componentName${component.id}`] = component.componentName;
      obj[`componentSP${component.id}`] = component.componentSP;
    })
    return obj;
  }
}
