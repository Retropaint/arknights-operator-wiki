import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { DatabaseService } from 'src/app/services/database.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-operator-gallery',
  templateUrl: './operator-gallery.component.html',
  styleUrls: ['./operator-gallery.component.scss'],
})
export class OperatorGalleryComponent implements OnInit {

  @ViewChild('opImage') opImage: any; 

  @Input() isTab: boolean = false;
  @Input() operator: Operator;

  backgroundBrightness: number = 18;

  reserveOpImageLink: string;
  defaultOpIconLink: string;

  loading: boolean = false;

  magnifiers: number[] = [];

  baseUrl: string = 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/characters/';

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
  }

  getMagnificaction(event) {
    this.magnifiers.push((event.path[0].width > 1024) ? 0.5 : 1);
  }

  imageLoaded() {
    this.loading = false;
  }

}
