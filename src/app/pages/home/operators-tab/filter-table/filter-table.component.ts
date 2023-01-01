import { Component, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';
import { Filter, FilterCategory, GeneratedFilter } from 'src/app/interfaces/operator-filter';
import { DatabaseService } from 'src/app/services/database.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss'],
})
export class FilterTableComponent implements OnInit {

  objectKeys = Object.keys;

  generatedFilters: GeneratedFilter[] = [];

  selectedAll: string = '';

  classes: FilterCategory = 
  {
    name: 'Classes',
    imgUrl: "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_",
    isFolded: false,
    filters: [
      {
        name: 'Caster',
        toggle: false,
        iconId: 'caster',
      },
      {
        name: 'Defender',
        toggle: false,
        iconId: 'defender'
      },
      {
        name: 'Guard',
        toggle: false,
        iconId: 'guard'
      },
      {
        toggle: false,
        name: "Medic",
        iconId: 'medic'
      },
      {
        toggle: false,
        name: "Sniper",
        iconId: 'sniper'
      },
      {
        toggle: false,
        name: "Specialist",
        iconId: 'specialist'
      },
      {
        toggle: false,
        name: "Supporter",
        iconId: 'supporter'
      },
      {
        toggle: false,
        name: "Vanguard",
        iconId: 'vanguard'
      },
    ]
  }

  branches: FilterCategory = {
    name: 'Branches',
    filters: [],
    imgUrl: 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/subclass/sub_',
    imgUrlSuffix: '_icon',
    isFolded: false
  };

  groups: FilterCategory = {
    name: 'Groups',
    filters: [],
    imgUrl: 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/factions/logo_',
    isFolded: false,
  };

  artists: FilterCategory = {
    name: 'Artists',
    filters: [],
    isFolded: false
  };

  filters = [this.classes, this.branches, this.groups, this.artists];

  constructor(
    private sharedService: SharedService,
    private database: DatabaseService
  ) { }

  ngOnInit() {
    this.createCategoryFilters();
  }

  sortCategory(filterName: string) {

    this.filters.forEach(category => {
      category.filters.forEach(filter => {
        filter.toggle = false;
      })
    })

    this.refreshBranchHighlights();

    if(this.selectedAll == filterName) {
      this.selectedAll = '';
      this.generatedFilters = [];      
    } else {
      this.generatedFilters = [
        {
          categoryName: filterName,
          toggles: []
        }
      ]
  
      this.selectedAll = filterName;
    }

    this.sharedService.operatorListRefreshSubscription.next(this.generatedFilters);
  }

  toggleFilter() {
    this.selectedAll = null;

    this.generatedFilters = [];

    this.refreshBranchHighlights();

    this.refreshGeneratedFilters();

    this.sharedService.operatorListRefreshSubscription.next(this.generatedFilters);
  }

  refreshGeneratedFilters() {
    let allClassesOff = true;

    this.filters.forEach(category => {
      category.filters.forEach(filter => {
        if(!allClassesOff && category.name == 'Branches' && !this.branchHighlight(filter.name, filter.associatedClass)) {
          return;
        }

        if(filter.toggle) {
          if(category.name == 'Classes') {
            allClassesOff = false;
          }

          const filterCategory = this.generatedFilters.find(generatedFilter => generatedFilter.categoryName == category.name)

          if(filterCategory) {
            filterCategory.toggles.push(filter.name)
          } else {
            this.generatedFilters.push(
              {
                categoryName: category.name,
                toggles: [filter.name]
              }
            )
          }
        }
      })
    })
  }

  branchHighlight(branch: string, assClass: string) {
    if(!this.classes.filters.find(filter => filter.name == assClass).toggle) {
      const branchFilter = this.branches.filters.find(filter => filter.name == branch);
      branchFilter.toggle = false;
      branchFilter.isHighlighted = false;
      
      return false;
    }

    return true;
  }

  createCategoryFilters() {

    // used to sort branches by class
    let associatedClasses: {
      branch: string;
      class: string;
    }[] = [];

    this.database.operators.forEach(operator => {
      this.checkFilter(this.artists.filters, operator.skins[0].artist, operator.originalBranch);
      this.checkFilter(this.groups.filters, operator.group.name, operator.group.id);
      this.checkBranchFilter(this.branches.filters, operator.branch, operator.originalBranch, operator.class, associatedClasses);
    })

    this.artists.filters.sort((a, b) => (a.name > b.name) ? -1 : 1); 
    this.groups.filters.sort((a, b) => (a.name > b.name) ? -1 : 1);
    this.branches.filters.sort((a, b) => (a.name > b.name) ? -1 : 1);
    
    this.branches.filters.sort((a, b) => {
      const aClass = associatedClasses.find(element => element.branch == a.name).class;
      const bClass = associatedClasses.find(element => element.branch == b.name).class;

      return (aClass > bClass) ? 1 : -1;
    })
  }

  checkFilter(filters: Filter[], property: string, iconLink: string) {
    const exists = filters.find(p => p.name == property);
    if(!exists) {
      filters.push({
        name: property,
        toggle: false,
        iconId: iconLink,
        isHighlighted: true
      })
    }
  }

  checkBranchFilter(filters: Filter[], branch: string, iconLink: string, opClass: string, associatedClasses: any) {
    const exists = filters.find(p => p.name == branch);
    if(!exists) {
      filters.push({
        name: branch,
        toggle: false,
        iconId: iconLink,
        associatedClass: opClass,
        isHighlighted: true
      })

      const branchClassExists = associatedClasses.find(element => element.branch == branch);
      if(!branchClassExists) {
        associatedClasses.push(
          {
            branch: branch,
            class: opClass
          }
        )
      }
    }
  }

  refreshBranchHighlights() {
    this.branches.filters.forEach(branch => {
      branch.isHighlighted = true;
    })
  }
}
