import { Component, Input, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { OperatorAvatarService } from 'src/app/services/operator-avatar.service';

@Component({
  selector: 'app-operator-briefer',
  templateUrl: './operator-briefer.component.html',
  styleUrls: ['./operator-briefer.component.scss'],
})
export class OperatorBrieferComponent implements OnInit {

  @ViewChild('description') desc: any;

  @Input() operator: Operator;

  operatorImageLink: string;

  constructor(
    private opAvatarService: OperatorAvatarService
  ) { }

  ngOnInit() {
    this.operatorImageLink = this.opAvatarService.getAvatar(this.operator);

    setTimeout(() => {
      this.desc.nativeElement.innerHTML = this.operator.trait;
    })
  }

}
