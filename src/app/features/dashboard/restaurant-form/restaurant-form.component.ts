import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent {

  constructor(
  ) { }

  submitted = false;

  onSubmit() {
    this.submitted = true;
  }

}
