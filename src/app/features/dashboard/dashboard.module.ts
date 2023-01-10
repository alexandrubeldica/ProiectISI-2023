import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { RestaurantFormComponent } from './restaurant-form/restaurant-form.component';

@NgModule({
  declarations: [DashboardComponent, RestaurantFormComponent],
  imports: [CommonModule, DashboardRoutingModule, MatToolbarModule],
})
export class DashboardModule {}