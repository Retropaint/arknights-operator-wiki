import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneratedFilter } from '../interfaces/operator-filter';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  operatorListRefreshSubscription = new Subject<GeneratedFilter[]>();

  operatorListRefresh = this.operatorListRefreshSubscription.asObservable();

  constructor() { }

  refreshOperatorList(filter: GeneratedFilter[]) {
    this.operatorListRefreshSubscription.next(filter);
  }
}
