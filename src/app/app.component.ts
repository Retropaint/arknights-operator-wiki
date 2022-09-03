import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DatabaseJsonGetterService } from './services/database-json-getter.service';
import { DoctorService } from './services/doctor.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private dbJsonGetter: DatabaseJsonGetterService,
    private doctorService: DoctorService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.storage.create();

    this.dbJsonGetter.init();
    this.doctorService.init();
  }
}
