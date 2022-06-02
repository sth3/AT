import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComponentModel, RecipeResponse } from '../models/recipe.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  getRecipes(): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>('http://localhost:3001/api/data')
      .pipe(map(response => ({
        draw: response.draw,
        recordsFiltered: response.recordsFiltered,
        recordsTotal: response.recordsTotal,
        data: response.data.map(recipe => ({
          id: recipe.id,
          no: recipe.no,
          name: recipe.name,
          components: this.getComponents(recipe)
        }))
      })));
  }

  private getComponents(recipe: any) {
    const arr: ComponentModel[] = [];
    Object.keys(recipe)
      .filter(key => key.startsWith('componentName'))
      .forEach(key => {
        const index = key.substring(13);
        arr.push({
          id: +index,
          componentName: key,
          componentSP: recipe[`componentSP${index}`]
        })
      })
    return arr;
  }
}
