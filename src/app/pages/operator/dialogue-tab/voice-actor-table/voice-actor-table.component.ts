import { Component, Input, OnInit } from '@angular/core';
import { Operator } from 'src/app/interfaces/operator';

@Component({
  selector: 'app-voice-actor-table',
  templateUrl: './voice-actor-table.component.html',
  styleUrls: ['./voice-actor-table.component.scss'],
})
export class VoiceActorTableComponent implements OnInit {

  @Input() operator: Operator;

  constructor() { }

  ngOnInit() {}

}
