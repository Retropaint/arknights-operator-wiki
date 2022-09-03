import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {

  @Input() value: boolean;

  @Output() onChanged = new EventEmitter<boolean>;

  constructor() { }

  ngOnInit() {}

  changeValue() {
    this.value = !this.value;
    this.onChanged.emit(this.value);
  }

}
