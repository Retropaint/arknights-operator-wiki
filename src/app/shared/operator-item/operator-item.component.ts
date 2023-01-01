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

  imgSrc: string;
  imgLoaded: boolean = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.imgSrc =  `assets/opAvatars/${this.operator.avatarLink}.png`;
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

  noLocalImg() {
    this.imgSrc = `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${this.operator.avatarLink}.png`;
    this.imgLoaded = true;
  }

}
