import { Component } from '@angular/core';
import { Filter, FilterCategory, GeneratedFilter } from 'src/app/interfaces/operator-filter';
import { DatabaseService } from 'src/app/services/database.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss'],
})
export class FilterTableComponent {

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
    filters: this.createCategoryFilter('branch'),
    imgUrl: 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/subclass/sub_',
    imgUrlSuffix: '_icon',
    isFolded: false
  };

  groups: FilterCategory = {
    name: 'Groups',
    filters: this.createCategoryFilter('group'),
    imgUrl: 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/factions/logo_',
    isFolded: false,
  };

  artists: FilterCategory = {
    name: 'Artists',
    filters: this.createCategoryFilter('artist'),
    isFolded: false
  };

  filters = [this.classes, this.branches, this.groups, this.artists];

  constructor(
    private sharedService: SharedService,
    private database: DatabaseService
  ) { }

  sortCategory(filterName: string) {

    this.filters.forEach(category => {
      category.filters.forEach(filter => {
        filter.toggle = false;
      })
    })

    this.branches.filters.forEach(branch => {
      branch.isHighlighted = true;
    })

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

    this.refreshGeneratedFilters();

    this.checkBranchesToHighlight();

    this.sharedService.operatorListRefreshSubscription.next(this.generatedFilters);
  }

  refreshGeneratedFilters() {
    this.filters.forEach(category => {
      category.filters.forEach(filter => {
        if(filter.toggle) {

          const filterCategory = this.generatedFilters.find(generatedFilter => generatedFilter.categoryName == category.name)

          // add toggle to its category if it exists
          if(filterCategory) {
            filterCategory.toggles.push(filter.name)
          } else {

            // if category doesn't exist, create it and add this toggle to it
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

  createCategoryFilter(opProperty: string): Filter[] {
    const filters: Filter[] = [];

    // used to sort branches by their class
    let branchesWithAssociatedClasses: {
      branch: string;
      class: string;
    }[] = [];

    this.database.operators.forEach(operator => {

      let propertyExists;
      switch(opProperty) {
        case 'artist':
          propertyExists = filters.find(property => property.name == operator.skins[0].artist);
        break; case 'group':
          propertyExists = filters.find(property => property.name == operator.group.name);
        break; default:
          propertyExists = filters.find(property => property.name == operator[opProperty]);
      }

      if(!propertyExists) {
        
        let propertyName: string = '';
        switch(opProperty) {
          case 'artist':
            propertyName = operator.skins[0].artist;
          break; case 'group':
            propertyName = operator.group.name;
          break; default:
            propertyName = operator[opProperty];
          break;
        }
        if(!propertyName) {
          return;
        }

        if(opProperty == 'branch') {
          const branchWithAssociatedClass = branchesWithAssociatedClasses.find(element => element.branch == propertyName);
          if(!branchWithAssociatedClass) {
            branchesWithAssociatedClasses.push(
              {
                branch: propertyName,
                class: operator.class
              }
            )
          }
        }
        
        let iconId: string = null;
        switch(opProperty) {
          case 'branch':
            iconId = operator.originalBranch
          break; case 'group':
            iconId = operator.group.id
        }

        filters.push(
          {
            name: propertyName,
            toggle: false,
            iconId: iconId,
            associatedClass: operator.class,
            isHighlighted: true
          }
        )
      }
    })

    filters.sort((a, b) => (a.name < b.name) ? -1 : 1) 

    if(opProperty == 'branch') {
      filters.sort((a, b) => (a.name > b.name) ? -1 : 1) 
      filters.sort((a, b) => {
        const aClass = branchesWithAssociatedClasses.find(element => element.branch == a.name).class;
        const bClass = branchesWithAssociatedClasses.find(element => element.branch == b.name).class;

        return (aClass > bClass) ? 1 : -1;
      })
    }

    return filters;
  }

  checkBranchesToHighlight() {
    const classesCategory = this.generatedFilters.find(filter => filter.categoryName == 'Classes');
    
    if(!classesCategory) {
      this.branches.filters.forEach(branch => {
        branch.isHighlighted = true;
      })
      return;
    }

    this.branches.filters.forEach(branch => {
      const shouldHighlight = this.generatedFilters.find(filter => filter.categoryName == 'Classes').toggles.find(toggle => toggle == branch.associatedClass) != null
      branch.isHighlighted = shouldHighlight;
      if(!shouldHighlight) {
        this.branches.filters.find(filter => filter == branch).toggle = false;

        // untoggle branches with no association to toggled classes, and modify generatedFilters accordingly
        const generatedBranches = this.generatedFilters.find(filter => filter.categoryName == 'Branches')
        if(generatedBranches != null) {

          // remove branch from array
          const generatedBranch = generatedBranches.toggles.findIndex(toggle => toggle == branch.name)
          if(generatedBranch != -1) {
            generatedBranches.toggles.splice(generatedBranch, 1);
          }

          // if there are no toggles in generatedBranches, remove branch array from generatedFilters entirely
          if(generatedBranches.toggles.length == 0) {
            const generatedBranchesIndex = this.generatedFilters.findIndex(filter => filter.categoryName == 'Branches');
            this.generatedFilters.splice(generatedBranchesIndex, 1);
          }
        } 

      }
    })
  }

}
