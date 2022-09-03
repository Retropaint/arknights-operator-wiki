import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-operator-gallery',
  templateUrl: './operator-gallery.component.html',
  styleUrls: ['./operator-gallery.component.scss'],
})
export class OperatorGalleryComponent implements OnInit {

  @ViewChild('opImage') opImage: any; 

  @Input() isTab: boolean = false;
  @Input() operator: Operator;

  chosenSkin: number = 0;
  magnificationMultiplier: number = 1;
  backgroundBrightness: number = 18;

  reserveOpImageLink: string;
  defaultOpIconLink: string;

  constructor(
    private database: DatabaseService
  ) { }

  ngOnInit() {
    // delay to wait for image to load
    setTimeout(() => {
      // 2048 size images magnifier double as much as 1024, so compensate by halving magnification
      if(this.opImage.fullWidth == 2048) {
        this.magnificationMultiplier = 0.5;
      } else {
        this.magnificationMultiplier = 1;
      }
    }, 50)

    if(this.database.specialReserveOps.find(operator => operator == this.operator.name) != null) {
      this.defaultOpIconLink = this.operator.id;
    } else {
      this.defaultOpIconLink = this.operator.id.slice(2, this.operator.id.length);
    }

    const specialReserveOp = this.database.specialReserveOps.find(operator => operator == this.operator.name);

    if(this.operator.name.includes('Reserve Operator') || specialReserveOp) {
      this.reserveOpImageLink = this.operator.id
    }
  }

}
