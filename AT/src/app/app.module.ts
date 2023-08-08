import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { NavComponent } from './components/nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './components/home/home.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotifierComponent } from './components/notifier/notifier.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RecipesComponent } from './components/recipes/recipes.component';
import { ComponentsComponent } from './components/components/components.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditComponentDialogComponent } from './components/edit-component-dialog/edit-component-dialog.component';
import { EditRecipeDialogComponent } from './components/edit-recipe-dialog/edit-recipe-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ToPDFComponent } from './components/to-pdf/to-pdf.component';
import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';

import { ErrorInterceptor } from './interceptors/error.interceptor';
import { UserControlComponent } from './components/user-control/user-control.component';
import { EditUserComponent } from './components/user-control/edit-user/edit-user.component';
import { PasswordChangeDialogComponent } from './components/user-control/password-change-dialog/password-change-dialog.component';
import { ArchivedComponentsTableComponent } from './components/components/archived-components-table/archived-components-table.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ArchivedRecipesTableComponent } from './components/recipes/archived-recipes-table/archived-recipes-table.component';
import { RecalculateRecipeComponent } from './components/recalculate-recipe/recalculate-recipe.component';
import { AggregateComponent } from './components/aggregate/aggregate.component';
import { OrdersArchiveComponent } from './components/orders-archive/orders-archive.component';
//import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {NgxPrintModule} from 'ngx-print';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import  localeSk  from '@angular/common/locales/sk';
import { registerLocaleData } from '@angular/common';
import { OrderSapComponent } from './components/order-sap/order-sap.component';
import { OrderDetailSapComponent } from './components/order-detail-sap/order-detail-sap.component';
import { RecalculateSapComponent } from './components/recalculate-sap/recalculate-sap.component';

registerLocaleData(localeSk, 'sk')

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    NotifierComponent,
    RecipesComponent,
    ComponentsComponent,
    ConfirmDialogComponent,
    EditComponentDialogComponent,
    EditRecipeDialogComponent,
    OrdersComponent,
    OrderDetailComponent,
    StatisticsComponent,
    ToPDFComponent,
    AuthDialogComponent,
    UserControlComponent,
    EditUserComponent,
    PasswordChangeDialogComponent,
    ArchivedComponentsTableComponent,
    ArchivedRecipesTableComponent,
    RecalculateRecipeComponent,
    AggregateComponent,
    OrdersArchiveComponent,
    OrderSapComponent,
    OrderDetailSapComponent,
    RecalculateSapComponent,
    
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        LayoutModule,
        MatToolbarModule,
        MatSidenavModule,
        MatIconModule,
        MatListModule,
        MatGridListModule,
        MatCardModule,
        MatMenuModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        FormsModule,
        MatProgressBarModule,
        MatInputModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSortModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatExpansionModule,
        NgxPrintModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
        HttpClientModule
    
    ],
    
  providers: [
    
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [TranslateModule]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
