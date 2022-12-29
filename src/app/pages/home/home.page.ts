import { Component, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { DatabaseJsonGetterService } from 'src/app/services/database-json-getter.service';
import { DatabaseService } from 'src/app/services/database.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [DialogService]
})
export class HomePage implements OnInit, OnDestroy {

  currentTab: 'operators' | 'items' = 'operators';
  isBlurry: boolean = false;
  favIcon: HTMLLinkElement;
  hasLoaded: boolean = false;

  routerSubscription: Subscription;
  jsonsLoadedSubscription: Subscription;
  toggledDialogSubscription: Subscription;

  windowWidth: number;

  constructor(
    public dbGetter: DatabaseJsonGetterService,
    private database: DatabaseService,
    private title: Title,
    private platform: Platform,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.changeTabDisplay();

    this.hasLoaded = this.database.isLoaded;

    this.windowWidth = this.platform.width();

    this.jsonsLoadedSubscription = this.sharedService.jsonsLoaded
      .subscribe(() => {
        this.hasLoaded = true;
      })

    this.toggledDialogSubscription = this.sharedService.toggledDialog
      .subscribe(result => {
        this.isBlurry = result;
      })
  }

  changeTabDisplay() {
    this.favIcon = <HTMLLinkElement>document.getElementById('appIcon');
    this.title.setTitle('Retropaint\'s Arknights Wiki');
    this.favIcon.href = 'assets/icon/favicon.png';
  }

  async onResize(event) {
    this.windowWidth = event.target.innerWidth;
  }

  ngOnDestroy() {
    this.toggledDialogSubscription.unsubscribe();
  }

}
