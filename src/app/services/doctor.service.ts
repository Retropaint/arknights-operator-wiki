import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Doctor, LevelBreakpoint } from '../interfaces/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor(
    private storage: Storage
  ) { }

  init() {
    this.storage.get('doctor')
      .then(doctor => {
        if(doctor == null) {
          const firstBreakpoint: LevelBreakpoint = {
            elite: 0,
            level: 0
          }

          const newDoctor: Doctor = {
            levelBreakpoints: [firstBreakpoint]
          }

          this.storage.set('doctor', newDoctor);
        }
      })
  }
}
