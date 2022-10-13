import { Component, OnInit } from '@angular/core';
import { Item, ItemCategory } from 'src/app/interfaces/item';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit {

  round = Math.round;

  grouped: boolean = true;

  groupedItems: ItemCategory[] = [
    {
      name: 'Skill Summaries',
      find: 'Skill Summary'
    },
    {
      name: 'Battle Records',
      find: 'Battle Record',
    },
    {
      name: 'Orirocks',
      find: 'Orirock',
    },
    {
      name: 'Oriron',
      find: 'Oriron',
    },
    {
      name: 'Devices',
      find: 'Device'
    },
    {
      name: 'Keton',
      find: 'keton',
      lowerCase: true
    },
    {
      name: 'Polyesters',
      find: 'ester',
      lowerCase: true,
    },
    {
      name: 'Sugars',
      find: 'Sugar',
    },
  ]

  groupedChips: ItemCategory[] = [
    {
      name: 'Chips',
      find: 'Chip'
    },
    {
      name: 'Chip Packs',
      find: 'Chip Pack'
    },
    {
      name: 'Dualchips',
      find: 'Dualchip'
    }
  ]

  miscellaneousItems: Item[] = [];

  allItems: Item[] = [];

  constructor(
    public database: DatabaseService
  ) { }

  ngOnInit() {

    this.database.items.forEach(item => {
      item.amount = 0;
    })

    this.groupedItems.forEach(category => {
      category.items = this.database.items.slice().filter(item => {
        if(category.lowerCase) {
          return item.name.toLowerCase().includes(category.find);
        } else {
          return item.name.includes(category.find);
        }
      })
    })

    this.groupedChips.forEach(category => {
      category.items = this.database.items.slice().filter(item => {
        if(category.lowerCase) {
          return item.name.toLowerCase().includes(category.find);
        } else {
          if(category.find == 'Chip') {
            return item.name.includes('Chip') && !item.name.includes('Chip Pack') && !item.name.includes('Chip Catalyst');
          } else {
            return item.name.includes(category.find);
          }
        }
      })
    })

    this.miscellaneousItems = this.database.items.slice().filter(item => {
      if(item.type != 'Growth Material') {
        return false;
      }
      for(let category of this.groupedItems) {
        const thisItem = category.items.find(groupedItem => groupedItem == item);
        if(thisItem) {
          return false;
        }
      }
      for(let category of this.groupedChips) {
        const thisItem = category.items.find(groupedItem => groupedItem == item);
        if(thisItem) {
          return false;
        }
      }
      return !item.name.includes('Token') && !item.name.includes('Letter');
    })

    this.allItems = this.database.items.slice().filter(item => item.type == 'Growth Material' && !item.name.includes('Token') && !item.name.includes('Letter'))
  }

  includes(itemName: string, string: string) {
    return itemName.includes(string);
  }

}
