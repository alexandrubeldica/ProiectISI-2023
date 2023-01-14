import { Component, OnInit } from '@angular/core';
import Restaurant from '../../../core/interfaces/restaurant.model';
import { DashboardAdminComponent } from '../dashboard-admin.component';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent {

  restaurant = new Restaurant();

  constructor(
    private dashboard: DashboardAdminComponent
  ) { }

  save(): void {
    this.dashboard.connectFirebase(this.restaurant);
  }
}