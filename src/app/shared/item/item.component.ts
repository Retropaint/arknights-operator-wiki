import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item';

@Component({
  selector: 'app-item-component',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {

  @Input() item: Item;
  @Input() isMastery: boolean = false;
  @Input() isGrouped: boolean = false;
  @Input() canClick: boolean = true;
  @Input() isOperatorPage: boolean = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }


}
