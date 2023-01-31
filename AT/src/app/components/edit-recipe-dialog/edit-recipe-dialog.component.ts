import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecipeModel } from '../../models/recipe.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentService } from '../../services/component.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentItemModel, ComponentModel } from '../../models/component.model';

@Component({
  selector: 'app-edit-recipe-dialog',
  templateUrl: 'edit-recipe-dialog.component.html',
})
export class EditRecipeDialogComponent implements OnInit {

  form: FormGroup;
  allComponents: ComponentModel[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  newComponent: FormControl = new FormControl('');
  selectedComponents: ComponentModel[] = [];
  filteredComponents!: Observable<ComponentModel[]>;
  currentWeight: number = 0;
  cWeight: number = 0;
  cQunatity: number = 0;
  targetWeight = 100;
  targetQunatity = 20;

  @ViewChild('componentInput', { static: false }) componentInput: ElementRef<HTMLInputElement> | undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                allRecipes: RecipeModel[],
                recipe: RecipeModel,
                editMode: boolean
              },
              private componentService: ComponentService) {
    console.log('recipe components: ', data.recipe?.components);
    this.form = new FormGroup({
      name: new FormControl(data.recipe ? data.recipe.name : '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(30), this.validRecipeNameValidator.bind(this)]),
      id: new FormControl(data.recipe ? data.recipe.id : this.getNewId(data.allRecipes),
        [Validators.required, Validators.minLength(6), Validators.maxLength(6),
          this.validRecipeIdValidator.bind(this)]),
      components: new FormArray(data.recipe ? data.recipe?.components!.map(component => {
        return new FormGroup({
          no: new FormControl(component.no),
          id: new FormControl(component.id),
          name: new FormControl(component.name.trim()),
          quantity: new FormControl(component.componentSP, Validators.required)
        })
      }) : []),
      // selectedComponents: new FormControl(data.recipe ? data.recipe.components!.map(component => component.componentName) : [])
    });
    this.form.get('components')?.valueChanges.subscribe(change => this.calculateWeight(change));
    
   
    
  }


  ngOnInit(): void {
    this.componentService.getComponents()
      .subscribe(response => {
        this.allComponents = response;
        this.selectedComponents = this.allComponents
          .filter(component => this.data.recipe?.components?.find(recipeComponent => recipeComponent.id === component.id));
        this.filteredComponents = this.newComponent.valueChanges.pipe(
          startWith(null),
          map((c: ComponentModel) => {
            return (c ? this._filter(c) : this.allComponents
              .filter(c => !this.selectedComponents.includes(c))
              .slice())
          }),
        );
      })
  }

  get name() {
    return this.form.get('name');
  }

  get id() {
    return this.form.get('id');
  }

  // get selectedComponents() {
  //   return this.form.get('selectedComponents') as FormArray;
  // }

  get components() {
    return this.form.get('components') as FormArray;
  }

  validRecipeNameValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.data.allRecipes.every(recipe => recipe.name !== value
      || (this.data.recipe !== null && recipe.no === this.data.recipe.no));
    return isValid ? null : { invalidRecipeName: true };
  }

  validRecipeIdValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.data.allRecipes.every(recipe => recipe.id !== value
      || (this.data.recipe !== null && recipe.no === this.data.recipe.no));
    return isValid ? null : { invalidRecipeId: true };
  }

  getNewId(allRecipes: RecipeModel[]) {
    const maxId = allRecipes
      .filter(r => !isNaN(parseInt(r.id)))
      .reduce((max, recipe) => Math.max(max, parseInt(recipe.id)), 0);
    return (maxId + 1).toString().padStart(6, '0');
  }

  setComponents() {
    const formArray = this.form.get('components') as FormArray;

    this.selectedComponents.forEach((component: ComponentModel) => {
      if (!formArray.controls.find(control => control.get('id')!.value === component.id)) {
        formArray.push(new FormGroup({
          no: new FormControl(component.no),
          id: new FormControl(component.id),
          name: new FormControl(component.name),
          quantity: new FormControl(0, Validators.required)
        }));
      }
    });
    if (this.selectedComponents.length < formArray.controls.length) {
      formArray.controls.forEach((control, index) => {
        if (!this.selectedComponents.find(component => component.id === control.get('id')!.value)) {
          formArray.removeAt(index);
        }
      });
    }
  }


  getFormValue() {
    if (!this.form.valid) {
      return;
    }
    const recipe = {
      id: this.id!.value,
      name: this.name!.value,
    }
    return {...recipe, components: this.getComponents() };
  }

  getComponents() {
    return this.components.value.map((c: any) => {
      return {
        no: c.no,
        id: c.id,
        name: c.name,
        componentSP: c.quantity
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      // @ts-ignore
      this.selectedComponents.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.newComponent.setValue(null);
  }

  remove(component: ComponentModel): void {
    const index = this.selectedComponents.indexOf(component);

    if (index >= 0) {
      this.selectedComponents.splice(index, 1);
      this.setComponents();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedComponents.push(event.option.value);
    this.componentInput!.nativeElement.value = '';
    this.newComponent.setValue(null);
    this.setComponents();

  }

  private _filter(value: string | ComponentModel): ComponentModel[] {
    if (typeof value !== 'string') {
      return [value];
    }
    const filterValue = value.toLowerCase();

    return this.allComponents
      .filter(c => !this.selectedComponents.includes(c))
      .filter(c => c.name.includes(filterValue));
  }

  calculateWeight(components: any[]): void {
    this.cWeight = components.reduce((acc, comp) => acc + comp.quantity, 0);
    this.cQunatity = this.form.get('components')?.value.length;
    this.currentWeight = Number(this.cWeight.toFixed(3));
   
    
  }
}


