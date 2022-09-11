import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit {

  text: any;
  results: string[] = [];

  chosenResult: number = 0;

  @Output() homePageReset = new EventEmitter<string>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private database: DatabaseService
  ) { }

  ngOnInit() {}

  search(event) {
    this.chosenResult = -1;

    event.query = event.query.toLowerCase();

    const newResults = [];

    this.database.operators.forEach(operator => {
      if(operator.name.toLowerCase().includes(event.query)) {
        newResults.push(operator.name);
      }
    })

    if(event.query == 'sex') {
      newResults.push('Suzuran')
    }
    if(event.query.includes('moist')) {
      newResults.push('Mostima')
    }
    if(event.query.includes('chen')) {
      if(event.query.length < 5) {
        newResults.push('Ch\'en');
      }
      newResults.push('Ch\'en the Holungday')
    }

    // prioritize shorter names, to allow original ops to appear before alters
    // this helps the original ops to be selected via enter key
    newResults.sort((a, b) => a.length > b.length ? 1 : -1)

    this.results = newResults;
  }

  async clickedSuggestion(suggestion: string) {
    if(suggestion == null) return;
    
    this.text = "";

    let urlParams = {
      'operator': encodeURI(suggestion)
    }

    await this.router.navigate(
      [], 
      {
        relativeTo: this.route,
        queryParams: urlParams,
      }
    )

    this.results = [];

    //this.transitioner.transitionSubscription.next(encodeURI(suggestion));
    this.homePageReset.emit(encodeURI(suggestion));
  }

  cycleChosenResult(increment: number) {
    this.chosenResult += increment;
    if(this.chosenResult < 0) {
      this.chosenResult = this.results.length - 1;
    } else if(this.chosenResult > this.results.length - 1) {
      this.chosenResult = 0;
    }
  }

}
