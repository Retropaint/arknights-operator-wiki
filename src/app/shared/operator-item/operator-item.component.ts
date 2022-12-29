import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-operator-item',
  templateUrl: './operator-item.component.html',
  styleUrls: ['./operator-item.component.scss'],
})
export class OperatorItemComponent implements OnInit {

  encodeURI = encodeURI;

  @Input() operator: Operator;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  async goToOperatorPage() {
    let urlParams = {
      'name': encodeURI(this.operator.name)
    }

    await this.router.navigate(
      ['/operator'], 
      {
        replaceUrl: true,
        queryParams: urlParams,
      }
    )
  }

}
