import { Injectable, Input } from '@angular/core';
import { Operator } from '../interfaces/operator';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class OperatorAvatarService {

  constructor(
    private database: DatabaseService
  ) { }

  getAvatar(operator: Operator) {
    if(operator.name == 'Amiya (Guard)') {
      return 'char_1001_amiya2';
    }

    let operatorImageLink = operator.id;

    const specialReserveOp = this.database.specialReserveOps.find(op => op == operator.name) != null;

    if(operator != null && operator.id && !specialReserveOp) {

      if(operator.name.includes('Reserve Operator')) {
        operatorImageLink = operator.id.slice(0, operator.id.length - 2);
      } else {
        operatorImageLink = operator.id.slice(2, operator.id.length);
      }

    }

    return operatorImageLink
  }
}
