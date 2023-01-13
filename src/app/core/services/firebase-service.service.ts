import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireList } from '@angular/fire/compat/database';
import Restaurant from '../interfaces/restaurant.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class FirebaseService {
  listFeed: Observable<any[]>;
  objFeed: Observable<any>;
  restaurantRef: AngularFireList<Restaurant>;

  constructor(public db: AngularFireDatabase) { }

  connectToDatabase() {
    this.listFeed = this.db.list('list').valueChanges();
    this.objFeed = this.db.object('obj').valueChanges();
  }

  addPointItem(restaurant: Restaurant) {
    return this.db.list('list').push(restaurant);
  }

  getAllRestaurants(): AngularFireList<Restaurant> {
    this.restaurantRef = this.db.list<Restaurant>('list');
    return this.restaurantRef;
  }

}
