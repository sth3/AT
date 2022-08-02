import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { ComponentsComponent } from './components/components/components.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ToPDFComponent } from './components/to-pdf/to-pdf.component';
import { UserControlComponent } from './components/user-control/user-control.component';
import { AdminGuard } from './interceptors/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'components', component: ComponentsComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'users', component: UserControlComponent, canActivate: [AdminGuard] },
  { path: 'pdf/:id', component: ToPDFComponent },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
