import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import Restaurant from '../interfaces/restaurant.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class FirebaseService {
  listFeed: Observable<any[]>;
  objFeed: Observable<any>;
  restaurants: Restaurant[]

  constructor(public db: AngularFireDatabase) {
  }

  connectToDatabase() {
    this.listFeed = this.db.list('list').valueChanges();
    this.objFeed = this.db.object('obj').valueChanges();
  }

  addPointItem(restaurant: Restaurant) {
    return this.db.list('list').push(restaurant);
  }

  // getPoints() {
  //   this.db.list('list').valueChanges().subscribe(restaurant => {
  //     this.restaurants.push(new Restaurant(restaurant.values[2], restaurant.values[1], restaurant.values[0]))
  //   });
  //   return this.restaurants;
  // }

  getChangeFeedList() {
      return this.listFeed;
  }

  getChangeFeedObj() {
      return this.objFeed;
  }

}
