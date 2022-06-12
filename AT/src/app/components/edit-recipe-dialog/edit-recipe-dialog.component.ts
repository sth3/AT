import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentModel, RecipeModel } from '../../models/recipe.model';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentService } from '../../services/component.service';

@Component({
  selector: 'app-edit-recipe-dialog',
  templateUrl: 'edit-recipe-dialog.component.html',
})
export class EditRecipeDialogComponent implements OnInit {

  form: FormGroup;
  allComponents: ComponentModel[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                allRecipes: RecipeModel[],
                recipe: RecipeModel,
                editMode: boolean
              },
              private componentService: ComponentService) {
    this.form = new FormGroup({
      name: new FormControl(data.recipe ? data.recipe.name : '',
        [Validators.required, Validators.minLength(3), this.validRecipeNameValidator.bind(this)]),
      id: new FormControl(data.recipe ? data.recipe.id : this.getNewId(data.allRecipes),
        [Validators.required, Validators.minLength(10), Validators.maxLength(10),
          this.validRecipeIdValidator.bind(this)]),
      components: new FormArray(data.recipe ? data.recipe?.components!.map(component => {
        return new FormGroup({
          name: new FormControl(component.componentName.trim()),
          quantity: new FormControl(component.componentSP, Validators.required)
        })
      }) : []),
      selectedComponents: new FormControl(data.recipe ? data.recipe.components!.map(component => component.componentName) : [])
    });
  }

  ngOnInit(): void {
    this.componentService.getComponents()
      .subscribe(response => {
        this.allComponents = response;
      })
  }

  get name() {
    return this.form.get('name');
  }

  get id() {
    return this.form.get('id');
  }

  get selectedComponents() {
    return this.form.get('selectedComponents') as FormArray;
  }

  get components() {
    return this.form.get('components') as FormArray;
  }

  validRecipeNameValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.data.allRecipes.every(recipe => recipe.name !== value
      || (this.data.recipe !== null && recipe.id === this.data.recipe.id));
    return isValid ? null : { invalidRecipeName: true };
  }

  validRecipeIdValidator(control: FormControl) {
    const value = control.value;
    const isValid = this.data.allRecipes.every(recipe => recipe.id !== value
      || (this.data.recipe !== null && recipe.id === this.data.recipe.id));
    return isValid ? null : { invalidRecipeId: true };
  }

  getNewId(allRecipes: RecipeModel[]) {
    const maxId = allRecipes.reduce((max, recipe) => Math.max(max, parseInt(recipe.id)), 0);
    return (maxId + 1).toString().padStart(10, '0');
  }

  setComponents() {
    const selectedComponents = this.selectedComponents.value;
    const formArray = this.form.get('components') as FormArray;
    selectedComponents.forEach((component: string) => {
      if (!formArray.controls.find(control => control.get('name')!.value === component)) {
        formArray.push(new FormGroup({
          name: new FormControl(component),
          quantity: new FormControl(0, Validators.required)
        }));
      }
    });
    if (selectedComponents.length < formArray.controls.length) {
      formArray.controls = formArray.controls.filter(control => selectedComponents.includes(control.get('name')!.value));
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
    return {...recipe, ...this.getComponents() };
  }

  getComponents() {
    const componentsObj: any = {};
    const components = this.components.value;
    for (let i = 0; i < components.length; i++) {
      componentsObj['componentName' + (i + 1)] = components[i].name;
      componentsObj['componentSP' + (i + 1)] = components[i].quantity;
    }
    return componentsObj;
  }
}


