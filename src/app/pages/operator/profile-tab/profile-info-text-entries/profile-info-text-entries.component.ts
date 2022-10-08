import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-profile-info-text-entries',
  templateUrl: './profile-info-text-entries.component.html',
  styleUrls: ['./profile-info-text-entries.component.scss'],
})
export class ProfileInfoTextEntriesComponent implements OnInit {

  @Input() operator: Operator;

  constructor() { }

  ngOnInit() {
    let index = 0;
    this.operator.profileEntries.forEach(entry => {
      if(index > 2) {
        const newline = new RegExp('\n', 'g');
        entry.description = entry.description.replace(newline, '<br>')
      }
      index++;
    })
  }
}
