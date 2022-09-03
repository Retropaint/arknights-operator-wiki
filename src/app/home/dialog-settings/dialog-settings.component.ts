import { Component, OnInit } from '@angular/core';
import { DoctorService } from 'src/app/services/doctor.service';
import { OperatorTransitionerService } from 'src/app/services/operator-transitioner.service';

@Component({
  selector: 'app-dialog-settings',
  templateUrl: './dialog-settings.component.html',
  styleUrls: ['./dialog-settings.component.scss'],
})
export class DialogSettingsComponent implements OnInit {

  editingBreakpoint: number = -1;
  editingElite: number = 0;
  editingLevel: number = 0;
  skillSlider: boolean = false;
  statSlider: boolean = false;

  constructor(
    public doctorService: DoctorService,
    private transitioner: OperatorTransitionerService
  ) { }

  ngOnInit() {
    this.skillSlider = this.doctorService.doctor.skillSlider;
    this.statSlider = this.doctorService.doctor.statSlider;
  }

  doneEditing() {
    this.doctorService.doctor.levelBreakpoints[this.editingBreakpoint] = {
      elite: this.editingElite,
      level: this.editingLevel
    }
    this.editingBreakpoint = -1;
  }

  editThisBreakpoint(index: number) {
    if(this.editingBreakpoint != -1) {
      return;
    }
    if(this.editingBreakpoint != index) {
      this.editingBreakpoint = index;
      this.editingElite = this.doctorService.doctor.levelBreakpoints[index].elite;
      this.editingLevel = this.doctorService.doctor.levelBreakpoints[index].level;
    }
  }

  addBreakpoint() {
    this.doctorService.doctor.levelBreakpoints.push({
      elite: 0,
      level: 0
    })
  }

  deleteBreakpoint() {
    this.doctorService.doctor.levelBreakpoints.splice(this.editingBreakpoint, 1);
    this.editingBreakpoint = -1;
  }

  pressedOutside() {
    
  }

  ngOnDestroy() {
    this.transitioner.transitionSubscription.next();
    this.doctorService.doctor.statSlider = this.statSlider;
    this.doctorService.doctor.skillSlider = this.skillSlider;
    this.doctorService.save();
  }

}
