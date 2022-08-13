import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AceshipService } from './services/aceship.service';
import { DoctorService } from './services/doctor.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private aceship: AceshipService,
    private doctorService: DoctorService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.storage.create();

    this.aceship.init();
    this.doctorService.init();
  }
}
