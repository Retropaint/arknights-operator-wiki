import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-dialogue-table',
  templateUrl: './dialogue-table.component.html',
  styleUrls: ['./dialogue-table.component.scss'],
})
export class DialogueTableComponent implements OnInit {

  @Input() operator!: Operator;

  charId: string;

  loadedLanguages = [false, false, false, false];

  constructor() { }

  ngOnInit() {
    let index = 0;
    setInterval(() => {
      this.loadedLanguages[index] = true;
      index++;
    }, 250)
    this.charId = this.operator.id.slice(2, this.operator.id.length);
  }

}
