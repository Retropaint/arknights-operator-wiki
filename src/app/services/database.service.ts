import { Injectable } from '@angular/core';
import { Item } from '../interfaces/item';
import { BaseSkill, Operator } from '../interfaces/operator';
import { Range } from '../interfaces/range';
import { Skin } from '../interfaces/skin';
import { Stage } from '../interfaces/stage';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  operators: Operator[] = [];
  items: Item[] = [];
  ranges: Range[] = [];
  skins: Skin[] = [];
  baseSkills: BaseSkill[] = [];
  stages: Stage[] = [];

  specialReserveOps = ['Sharp', 'Touch', 'Pith', 'Stormeye'];

  isLoaded: boolean;

  constructor() { }
}
