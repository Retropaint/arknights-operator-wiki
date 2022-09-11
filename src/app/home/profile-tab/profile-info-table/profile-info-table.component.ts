import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-profile-info-table',
  templateUrl: './profile-info-table.component.html',
  styleUrls: ['./profile-info-table.component.scss'],
})
export class ProfileInfoTableComponent implements OnInit {

  @Input() operator: Operator;
  @Input() entry: 'basic' | 'physical'

  basicInfo: {
    key?: string;
    value?: string;
  }[] = [{key: '', value: ''}];

  constructor() { }

  ngOnInit() {
    let isGettingKey = true;
    let fullString = '';
    let prevWordWasEmpty = false;
    
    let split = this.operator.profileEntries[0].description.split(/[\[\]\n ]/)
    if(this.entry == 'physical') {
      split = this.operator.profileEntries[1].description.split(/[\[\]\n ]/)
    }

    const physical = split.findIndex(word => word == 'Physical');
    const strength = split.findIndex(word => word == 'Strength');
    if(physical != null && strength != null) {  
      split.splice(strength+1, 0, '');
    }

    // separate the rating boxes from Originium Arts Assimilation
    const assimilation = split.findIndex(word => word == 'Assimilation');
    if(assimilation != null) {  
      split.splice(assimilation+1, 0, '');
    }

    // remove stray whitespaces
    while(split[0] == '') {
      split.shift();
    }

    console.log(split)

    split.forEach(word => {
      if(word == '') {
        // ignore empty elements after the first
        if(prevWordWasEmpty) {
          return;
        }

        // if getting infection status value, empty elements mean a new line
        if(this.basicInfo[this.basicInfo.length -1].key == 'Infection Status') {
          fullString += '<br>'
          return;
        }
        isGettingKey = !isGettingKey;
        
        // since fullString adds a whitespace after every word, remove it from last one
        fullString = fullString.slice(0, fullString.length - 1);
        
        if(isGettingKey) {
          this.basicInfo[this.basicInfo.length - 1].value = fullString;
          this.basicInfo.push({});
        } else {
          this.basicInfo[this.basicInfo.length - 1].key = fullString;
        }
        
        fullString = '';
        prevWordWasEmpty = true;
      } else {
        fullString += word + ' ';
        prevWordWasEmpty = false;
      }
    })

    this.basicInfo[this.basicInfo.length - 1].value = fullString;
  }

}
