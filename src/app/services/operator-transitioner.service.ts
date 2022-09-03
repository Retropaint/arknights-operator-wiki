import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperatorTransitionerService {

  transitionSubscription = new Subject<string>();

  transition = this.transitionSubscription.asObservable();

  constructor() { }
}
