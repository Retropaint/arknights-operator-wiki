import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Operator } from 'src/app/interfaces/operator';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {

  encodeURI = encodeURI;

  text: any;
  results: {
    img: string,
    rarity: string,
    name: string
  }[] = [];

  chosenResult: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private database: DatabaseService,
  ) { }

  ngOnInit() {
    this.text = '';
  }

  search(event) {
    this.chosenResult = -1;

    event.query = event.query.toLowerCase();

    const newResults = [];

    this.database.operators.forEach(operator => {
      if(operator.name.toLowerCase().includes(event.query)) {
        newResults.push(this.addOp('', operator))
      }
    })

    if(event.query == 'sex') {
      newResults.push(this.addOp('Suzuran'))
    }
    if(event.query.includes('moist')) {
      newResults.push(this.addOp('Mostima'))
    }
    if(event.query.includes('chen')) {
      if(event.query.length < 5) {
        newResults.push(this.addOp('Ch\'en'))
      }
      newResults.push(this.addOp('Ch\'en the Holungday'))
    }

    // make the op with a similar, shorter name go above the longer one to allow navigating using Enter
    if(newResults[0]?.name.includes(' the ') || newResults.length == 2 && newResults[0].rarity == newResults[1].rarity) {
      newResults.sort((a, b) => a.name > b.name ? 1 : -1)
    } else {
      newResults.sort((a, b) => a.name < b.name ? 1 : -1)
      newResults.sort((a, b) => a.rarity < b.rarity ? 1 : -1)
    }

    this.results = newResults;
  }

  async clickedSuggestion(suggestion: string, fromKeyboard: boolean = false) {
    if(suggestion != null || !fromKeyboard) {
      this.text = "";
    }

    if(!fromKeyboard) return;

    let urlParams = {
      'name': encodeURI(suggestion)
    }

    await this.router.navigate(
      ['/operator'], 
      {
        replaceUrl: true,
        queryParams: urlParams,
      }
    )

    this.results = [];
  }

  cycleChosenResult(increment: number) {
    this.chosenResult += increment;
    if(this.chosenResult < 0) {
      this.chosenResult = this.results.length - 1;
    } else if(this.chosenResult > this.results.length - 1) {
      this.chosenResult = 0;
    }
  }

  addOp(name: string, operator: Operator = null) {
    if(operator == null) {
      operator = this.database.operators.find(op => op.name == name);
    }
    const newOp = {
      img: 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/' + operator.avatarLink + '.png',
      rarity: operator.rarity,
      name: operator.name
    }
    return newOp;
  }

}
