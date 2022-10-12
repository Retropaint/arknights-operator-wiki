import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
  providers: [DialogService]
})
export class ItemPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
