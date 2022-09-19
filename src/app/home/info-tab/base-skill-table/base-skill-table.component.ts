import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-base-skill-table',
  templateUrl: './base-skill-table.component.html',
  styleUrls: ['./base-skill-table.component.scss'],
})
export class BaseSkillTableComponent implements OnInit {

  @Input() operator: Operator;

  hasRefreshed: boolean = false;

  @ViewChildren('description') descs: any;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      for(let i = 0; i < this.descs._results.length; i++) {
        const desc = this.descs._results[i];
        desc.nativeElement.innerHTML = this.operator.baseSkills[i].description
      }
    })
  }
}
