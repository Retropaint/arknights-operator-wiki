import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Operator } from 'src/app/interfaces/operator';
import { DatabaseService } from 'src/app/services/database.service';
import { OperatorAvatarService } from 'src/app/services/operator-avatar.service';

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

  @Output() homePageReset = new EventEmitter<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private database: DatabaseService,
    public opAvatarService: OperatorAvatarService
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

    // check if results are only an op and their alter
    let isAlter: boolean = false;
    if(newResults.length == 2) {
      const firstResultWord = newResults[0].name.split(' ')[0];
      const secondResultWord = newResults[1].name.split(' ')[0];
      if(firstResultWord == secondResultWord) {
        isAlter = true;
      }
    }

    if(!isAlter) {
      // sort by rarity, then alphabetically
      newResults.sort((a, b) => a.name < b.name ? 1 : -1)
      newResults.sort((a, b) => a.rarity < b.rarity ? 1 : -1)
    } else {
      // for ops and their alter, put original first
      newResults.sort((a, b) => a.name.length > b.name.length ? 1 : -1)
    }

    this.results = newResults;
  }

  async clickedSuggestion(suggestion: string) {
    if(suggestion != null) {
      this.text = "";
    }
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
      img: 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/' + this.opAvatarService.getAvatar(operator) + '.png',
      rarity: operator.rarity,
      name: operator.name
    }
    return newOp;
  }

}
