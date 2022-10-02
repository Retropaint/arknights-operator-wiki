import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { DatabaseService } from 'src/app/services/database.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  baseUrl = 'assets/operatorSkins/'

  constructor(
    private database: DatabaseService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    // special reserve ops are so quirkyyyy!!! UwU
    const specialReserveOp = this.database.specialReserveOps.find(operator => operator == this.operator.name);

    if(specialReserveOp) {
      this.defaultOpIconLink = this.operator.id;
    } else {
      this.defaultOpIconLink = this.operator.id.slice(2, this.operator.id.length);
    }

    if(this.operator.name.includes('Reserve Operator') || specialReserveOp) {
      this.reserveOpImageLink = this.operator.id
    }

    // check if this operator's skin images exist locally
    this.http.get('assets/operatorSkins/' + this.operator.skins[0].id + '.png')
      .subscribe(result => {}, 
      error => {
        if(error.status != '200') {
          // get image from aceship because I was too lazy to download it apparently
          this.baseUrl = 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/characters/'
        }
      })
  }

  onHover() {
    // 2048 size images magnifier double as much as 1024, so compensate by halving magnification
    if(this.opImage.fullWidth == 2048) {
      this.magnificationMultiplier = 0.5;
    } else {
      this.magnificationMultiplier = 1;
    }
  }

}
