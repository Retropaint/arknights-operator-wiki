import { AfterViewInit, Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-operator-briefer',
  templateUrl: './operator-briefer.component.html',
  styleUrls: ['./operator-briefer.component.scss'],
})
export class OperatorBrieferComponent implements AfterViewInit {

  @ViewChild('description') desc: any;

  @Input() operator: Operator;

  constructor(
    private sharedService: SharedService
  ) { }

  ngAfterViewInit() {
    this.sharedService.addTooltips(this.desc, this.operator.trait);
  }

}
