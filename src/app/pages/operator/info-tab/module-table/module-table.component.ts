import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-module-table',
  templateUrl: './module-table.component.html',
  styleUrls: ['./module-table.component.scss'],
})
export class ModuleTableComponent implements OnInit, AfterViewInit {

  @ViewChild('trait') traitHTML: ElementRef;

  @Input() operator: Operator;
  @Input() moduleIndex: number;

  trait: string;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    if(this.moduleIndex == 0) {
      return;
    }

    const module = this.operator.modules[this.moduleIndex];
    
    if(module.trait) {
      this.trait = module.trait;

      // parse stat values, just like skill table 
      module.traitStats.forEach(stat => {
        const statStrings = [
          `+{${stat.key}}`,
          `{${stat.key}:0%}`,
          `{${stat.key}}`,
          `{${stat.key} 0%}`,
          `{${stat.key} 0}`
        ];
        statStrings.forEach(string => {
          let multiplier = 1;
          let percent = '';
          if(string.includes('%')) {
            multiplier = 100;
            percent = '%'
          }
          this.trait = this.trait.replace(string, `${Math.round(stat.value*multiplier)}${percent}`);
        })
      })
    }
  }

  ngAfterViewInit() {
    this.sharedService.addTooltips(this.traitHTML, this.trait);
  }

}
