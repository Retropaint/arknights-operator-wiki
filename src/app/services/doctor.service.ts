import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Doctor, LevelBreakpoint } from '../interfaces/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  doctor: Doctor;

  constructor(
    private storage: Storage
  ) { }

  init() {
    this.storage.get('doctor')
      .then(doctor => {
        if(doctor == null) {
          const bp1: LevelBreakpoint = {
            elite: 1,
            level: 999
          }
          const bp2: LevelBreakpoint = {
            elite: 2,
            level: 999
          }

          const newDoctor: Doctor = {
            levelBreakpoints: [bp1, bp2],
            statSlider: true,
            skillSlider: true
          }

          this.storage.set('doctor', newDoctor);

          this.doctor = newDoctor;
        } else {
          this.doctor = doctor;
        }
      })
  }

  save() {
    this.storage.set('doctor', this.doctor);
  }
}
