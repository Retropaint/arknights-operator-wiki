import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/interfaces/item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: Item;
  @Input() isMastery: boolean = false;
  @Input() isGrouped: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
