import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Operator } from 'src/app/interfaces/operator';
import { OperatorDivision, GeneratedFilter } from 'src/app/interfaces/operator-filter';
import { DatabaseService } from 'src/app/services/database.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-operator-list',
  templateUrl: './operator-list.component.html',
  styleUrls: ['./operator-list.component.scss'],
})
export class OperatorListComponent implements OnInit {

  operatorListRefresh: Subscription;

  generatedFilters: GeneratedFilter[];

  operatorDivisions: OperatorDivision[];

  constructor(
    private sharedService: SharedService,
    private database: DatabaseService
  ) { }

  ngOnInit() {
    this.operatorListRefresh = this.sharedService.operatorListRefresh
      .subscribe(result => {
        this.generatedFilters = result;
        this.refresh();
      })

    this.refresh();
  }

  refresh() {
    if(this.generatedFilters == null) {
      this.operatorDivisions = [
        {
          name: null,
          operators: this.database.operators
        }
      ]
    } else {
      // if there is only 1 category and there are no toggles, sort by that category
      if(this.generatedFilters.length == 1 && this.generatedFilters[0].toggles.length == 0) {
        switch(this.generatedFilters[0].categoryName) {
          case 'Classes':
            this.sort('class');
          break; case 'Branches':
            this.sort('branch')
          break; case 'Artists':
            this.sort('artist')
          break; case 'Groups':
            this.sort('group')
          break;
        }
      } else {
        this.filter();
      }
    }

    this.operatorDivisions.forEach(filter => {
      filter.operators.sort((a, b) => a.name < b.name ? 1 : -1)
      filter.operators.sort((a, b) => a.rarity < b.rarity ? 1 : -1)
    })
  }

  sort(opProperty: string) {

    this.operatorDivisions = [];

    let branchesWithAssociatedClasses: {
      branch: string;
      class: string;
    }[] = [];

    this.database.operators.slice().forEach(operator => {
      let propertyToDivideBy;
      switch(opProperty) {
        case 'artist':
          propertyToDivideBy = operator.skins[0].artist;
        break; case 'group':
          propertyToDivideBy = operator.group.name;
        break; default:
          propertyToDivideBy = operator[opProperty]
        break;
      }


      if(opProperty == 'branch') {
        const branchWithAssociatedClass = branchesWithAssociatedClasses.find(element => element.branch == operator.branch);
        if(!branchWithAssociatedClass) {
          branchesWithAssociatedClasses.push(
            {
              branch: operator.branch,
              class: operator.class
            }
          )
        }
      }

      const propertyDivider = this.operatorDivisions.find(filter => filter.name == propertyToDivideBy);

      // put operator in appropriate divider if it exists
      if(propertyDivider != null) {
        propertyDivider.operators.push(operator);
      } else {
        // make a new divider and put the op in it
        this.operatorDivisions.push(
          {
            name: propertyToDivideBy,
            operators: [operator]
          }
        )
      }
    })

    this.operatorDivisions.sort((a, b) => a.name > b.name ? -1 : 1);
    if(opProperty == 'branch') {
      this.operatorDivisions.sort((a, b) => {
        const aClass = branchesWithAssociatedClasses.find(element => element.branch == a.name).class;
        const bClass = branchesWithAssociatedClasses.find(element => element.branch == b.name).class;
  
        return (aClass > bClass) ? 1 : -1;
      })
    }
  }

  filter() {
    let currentOperators = this.database.operators.slice();

    this.generatedFilters.forEach(filter => {
      switch(filter.categoryName) {
        case 'Classes':
          currentOperators = currentOperators.filter(op => filter.toggles.find(opClass => opClass == op.class) != null)
        break; case 'Branches':
          currentOperators = currentOperators.filter(op => filter.toggles.find(branch => branch == op.branch) != null)
        break; case 'Artists':
          currentOperators = currentOperators.filter(op => filter.toggles.find(artist => artist == op.skins[0].artist) != null)
        break; case 'Groups':
          currentOperators = currentOperators.filter(op => filter.toggles.find(group => group == op.group.name) != null)
        break;
      }
    })

    this.operatorDivisions = [
      {
        name: null,
        operators: currentOperators
      }
    ];

  }

}
