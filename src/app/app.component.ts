import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
    private storage: Storage,
  ) {}

  ngOnInit() {
    // random console logs that are the absolute peak of comedy
    const randomLog = ["Azur Lane is better", "I can code as well as Hibiscus can cook", "No I am NOT making a mobile view stop asking"];
    const chosenLog = Math.round(Math.random() * (randomLog.length-1));
    setTimeout(() => {
      console.log(randomLog[chosenLog]);
    }, 500) 

    this.storage.create();

    this.dbJsonGetter.init();
    this.doctorService.init();
  }

  
}
