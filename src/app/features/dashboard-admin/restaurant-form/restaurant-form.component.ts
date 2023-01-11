import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase-service.service';
import Restaurant from '../../../core/interfaces/restaurant.model';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent {

  isConnected: boolean = false;
  restaurant: Restaurant = new Restaurant()

  constructor(
    private fbs: FirebaseService
  ) { }

  submitted = false;

  save(): void {
    this.fbs.addPointItem(this.restaurant);
  }
}