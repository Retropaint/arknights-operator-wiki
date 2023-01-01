import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Operator } from 'src/app/interfaces/operator';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-base-skill-table',
  templateUrl: './base-skill-table.component.html',
  styleUrls: ['./base-skill-table.component.scss'],
})
export class BaseSkillTableComponent implements AfterViewInit {

  @Input() operator: Operator;

  hasRefreshed: boolean = false;

  @ViewChildren('description') descs: QueryList<ElementRef>;

  constructor(
    private sharedService: SharedService
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      for(let i = 0; i < this.operator.baseSkills.length; i++) {
        this.sharedService.addTooltips(this.descs.toArray()[i], this.operator.baseSkills[i].description, false);
      }
    })
  }
}
