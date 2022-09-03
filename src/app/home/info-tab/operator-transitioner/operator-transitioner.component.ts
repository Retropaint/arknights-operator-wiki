import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { OperatorTransitionerService } from 'src/app/services/operator-transitioner.service';

@Component({
  selector: 'app-operator-transitioner',
  templateUrl: './operator-transitioner.component.html',
  styleUrls: ['./operator-transitioner.component.scss'],
})
export class OperatorTransitionerComponent implements OnInit {

  firstOpacity: number = 0;
  secondOpacity: number = 0;
  phase: number = 0;
  increments: number = 0.05;
  hasLoaded: boolean;

  @Output() changeOperator = new EventEmitter<string>();
  
  constructor(
    private transitioner: OperatorTransitionerService
  ) { }

  ngOnInit() {

    this.transitioner.transition
      .subscribe(operator => {
        this.secondOpacity = 0;
        this.firstOpacity = 0;
        this.phase = 0;
        this.hasLoaded = false;
        this.fade(operator);
      })
  }

  fade(operator: string) {
    const thisInterval = setInterval(() => {
      switch(this.phase) {
        case 0: 
          this.firstOpacity += this.increments;
          if(this.firstOpacity >= 1) {
            this.firstOpacity = 1;
            this.phase = 1;
          }
        break; case 1:
          this.secondOpacity += this.increments;
          if(this.secondOpacity >= 1) {
            if(!this.hasLoaded) {
              this.changeOperator.emit(operator);
              this.hasLoaded = true;
            }
            this.secondOpacity = 1;
            setTimeout(() => {
              this.phase = 2;
            }, 500)
          }
        break; case 2:
          this.firstOpacity -= this.increments;
          if(this.firstOpacity < 0) {
            this.firstOpacity = 0;
            this.phase = 3;
          }
        break; case 3:
          this.secondOpacity -= this.increments;
          if(this.secondOpacity < 0) {
            
            clearInterval(thisInterval);
          }
      }
      
    }, 0.1)
  }

  ngOnDestroy() {
  }

}
