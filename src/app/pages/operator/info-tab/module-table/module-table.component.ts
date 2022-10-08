import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-module-table',
  templateUrl: './module-table.component.html',
  styleUrls: ['./module-table.component.scss'],
})
export class ModuleTableComponent implements OnInit {

  @Input() operator: Operator;
  @Input() moduleIndex: number;

  trait: string;

  constructor() { }

  ngOnInit() {
    if(this.moduleIndex == 0) {
      return;
    }

    const module = this.operator.modules[this.moduleIndex];
    
    if(module.trait) {
      this.trait = module.trait;

      // fast-redploy modules
      this.trait = this.trait.replace('a large portion', '80%')

      // parse stat values, just like skill table 
      module.traitStats.forEach(stat => {
        const statStrings = [
          `+{${stat.key}} `,
          `{${stat.key}:0%} `,
          `{${stat.key}} `
        ];
        statStrings.forEach(string => {
          let multiplier = 1;
          let percent = '';
          if(string.includes('%')) {
            multiplier = 100;
            percent = '%'
          }
          this.trait = this.trait.replace(string, `${Math.round(<number>stat.value*multiplier)}${percent}`);
        })
      })
    }
    
  }

}
