import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item';
import { Operator } from '../interfaces/operator';
import { Range } from '../interfaces/range';
import { Skin } from '../interfaces/skin';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  operators: Operator[] = [];
  items: Item[] = [];
  ranges: Range[] = [];
  skins: Skin[] = [];

  specialReserveOps = ['Sharp', 'Touch', 'Pith', 'Stormeye'];

  constructor() { }
}
