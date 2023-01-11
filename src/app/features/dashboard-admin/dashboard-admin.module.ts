import { CommonModule } from '@angular/common';
import { DashboardAdminComponent } from './dashboard-admin.component';
import { DashboardRoutingModule } from './dashboard-admin-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { RestaurantFormComponent } from './restaurant-form/restaurant-form.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardAdminComponent, RestaurantFormComponent],
  imports: [CommonModule, DashboardRoutingModule, MatToolbarModule, FormsModule]
})
export class DashboardAdminModule {}