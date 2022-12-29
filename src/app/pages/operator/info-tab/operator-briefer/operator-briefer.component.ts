import { Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-operator-briefer',
  templateUrl: './operator-briefer.component.html',
  styleUrls: ['./operator-briefer.component.scss'],
})
export class OperatorBrieferComponent implements OnInit {

  @ViewChild('description') desc: any;

  @Input() operator: Operator;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.desc.nativeElement.innerHTML = this.operator.trait;
    })
  }

}
