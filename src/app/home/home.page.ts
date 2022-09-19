import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ChildActivationEnd, NavigationEnd, Router, RouterEvent, Scroll } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Operator } from '../interfaces/operator';
import { DatabaseService } from '../services/database.service';
import { OperatorAvatarService } from '../services/operator-avatar.service';
import { OperatorTransitionerService } from '../services/operator-transitioner.service'
import { DialogSettingsComponent } from './dialog-settings/dialog-settings.component';
import { StatTableComponent } from './info-tab/stat-table/stat-table.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [DialogService]
})
export class HomePage implements OnInit, OnDestroy {

  operator: Operator;
  isGalleryOpen: boolean = false;
  currentTab: string = 'info';
  isBlurry: boolean = false;
  favIcon!: HTMLLinkElement;

  // prevents route subscription from triggering when site is newly loaded
  isFirstLoad: boolean = false;

  routerSubscription: Subscription;
  transitionSubscription: Subscription;

  @ViewChild(StatTableComponent) statTable; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transitioner: OperatorTransitionerService,
    private dialogService: DialogService,
    private database: DatabaseService,
    private title: Title,
    private opAvatarService: OperatorAvatarService
  ) {}

  ngOnInit(): void {

    // random console logs that are the absolute peak of comedy
    const randomLog = ["Azur Lane is better", "I can code as well as Hibiscus can cook", "No I am NOT making a mobile view stop asking"];
    const chosenLog = Math.round(Math.random() * (randomLog.length-1));
    setTimeout(() => {
      console.log(randomLog[chosenLog]);
    }, 500) 

    let navigationParams;

    // refresh page on navigation
    this.routerSubscription = this.router.events.subscribe((result: RouterEvent) => {
      if(result instanceof ChildActivationEnd) {
        navigationParams = result['snapshot'].queryParams['operator'];
      } else if(result instanceof Scroll) {

        // don't do anything for first operator
        if(!this.isFirstLoad) {
          this.isFirstLoad = true;
          return;
        }

        this.refresh(navigationParams != null ? navigationParams : 'Hibiscus')
      }
    })

    // page refresher (for non-navigation)
    const urlParams = this.route.snapshot.queryParams;
    this.transitionSubscription = this.transitioner.transition
      .subscribe(() => {

        // ok I know I just said this is a page refresher, but if isBlurry is on then settings dialog was closed, so just refresh stats table instead
        if(this.isBlurry) {
          this.isBlurry = false;
          if(this.statTable != null) {
            this.statTable.ngOnInit();
          }
        } else {
          this.refresh(urlParams['operator'] != null ? urlParams['operator'] : 'Hibiscus')
        }

      })

  }

  refresh(newOperator: string) {
    // destroy all components so they refresh
    this.operator = null;
    
    setTimeout(() => {
      const operatorIndex = this.database.operators.findIndex(operator => encodeURIComponent(operator.name.toLowerCase()) == newOperator.toLowerCase())
      this.operator = this.database.operators[operatorIndex];
      //console.log(this.operator)
      this.title.setTitle(this.operator.name + ' | Retro\'s Arknights Wiki');
      this.changeFavicon();
    })
  }

  openSettingsModal() {
    this.isBlurry = true;
    this.dialogService.open(DialogSettingsComponent, {
      dismissableMask: true,
      transitionOptions: '0ms',
      maskStyleClass: 'modal-background',
    })
  }

  changeFavicon() {
    this.favIcon = <HTMLLinkElement>document.getElementById('appIcon');
    this.favIcon.href = 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/' + this.opAvatarService.getAvatar(this.operator) + '.png';
  }

  ngOnDestroy() {
    this.transitionSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

}
