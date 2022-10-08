import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GeneratedFilter } from '../interfaces/operator-filter';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  operatorListRefreshSubscription = new Subject<GeneratedFilter[]>();
  operatorListRefresh = this.operatorListRefreshSubscription.asObservable();

  toggledDialogSubscription = new Subject<boolean>();
  toggledDialog = this.toggledDialogSubscription.asObservable();

  jsonsLoadedSubscription = new Subject<null>();
  jsonsLoaded = this.jsonsLoadedSubscription.asObservable();

  constructor() { }

  refreshOperatorList(filter: GeneratedFilter[]) {
    this.operatorListRefreshSubscription.next(filter);
  }

  toggleDialog(toggle: boolean) {
    this.toggledDialogSubscription.next(toggle);
  }

  allJsonsLoaded() {
    this.jsonsLoadedSubscription.next();
  }
}
