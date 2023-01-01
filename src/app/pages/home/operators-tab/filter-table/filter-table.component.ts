import { Component, OnInit } from '@angular/core';
import { FilterService } from 'src/app/filter.service';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss'],
})
export class FilterTableComponent implements OnInit {

  objectKeys = Object.keys;

  constructor(
    public filterService: FilterService
  ) { }

  ngOnInit() {
    if(!this.filterService.createdFilters) {
      this.filterService.createCategoryFilters();
    }
  }
}
