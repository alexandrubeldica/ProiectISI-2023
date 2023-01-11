import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import Restaurant from '../interfaces/restaurant.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class FirebaseService {
  restaurants: AngularFireList<Restaurant>
  listFeed: Observable<any[]>;
  objFeed: Observable<any>;

  constructor(public db: AngularFireDatabase) {
  }

  connectToDatabase() {
    this.listFeed = this.db.list('list').valueChanges();
    this.objFeed = this.db.object('obj').valueChanges();
  }

  create(restaurant: Restaurant): any {
    return this.restaurants.push(restaurant);
  }

  addPointItem(restaurant: Restaurant) {
    this.db.list('list').push(restaurant);
    // console.log(this.db.database.ref('list').key);
  }

}
