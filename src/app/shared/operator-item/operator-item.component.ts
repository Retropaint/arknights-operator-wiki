import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Operator } from 'src/app/interfaces/operator';
import { OperatorAvatarService } from 'src/app/services/operator-avatar.service';
import { OperatorTransitionerService } from 'src/app/services/operator-transitioner.service';

@Component({
  selector: 'app-operator-item',
  templateUrl: './operator-item.component.html',
  styleUrls: ['./operator-item.component.scss'],
})
export class OperatorItemComponent implements OnInit {

  encodeURI = encodeURI;

  @Input() operator: Operator;

  operatorImageLink: string;

  constructor(
    private opAvatarService: OperatorAvatarService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.operatorImageLink = this.opAvatarService.getAvatar(this.operator);
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
