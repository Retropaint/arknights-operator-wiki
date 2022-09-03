import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Operator } from '../interfaces/operator';
import { DatabaseService } from '../services/database.service';
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
  currentTab: 'info' | 'gallery' = 'info';
  isBlurry: boolean = false;

  routerSubscription: Subscription;
  transitionSubscription: Subscription;

  @ViewChild(StatTableComponent) statTable; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transitioner: OperatorTransitionerService,
    private dialogService: DialogService,
    private database: DatabaseService
  ) {}

  ngOnInit(): void {
    const randomLog = ["Azur Lane is better", "I can code as well as Hibiscus can cook", "No I am NOT making a mobile view stop asking"];
    const chosenLog = Math.floor(Math.random() * randomLog.length);
    setTimeout(() => {
      console.log(randomLog[chosenLog]);
    }, 500) 

    const urlParams = this.route.snapshot.queryParams;

    this.routerSubscription = this.router.events.subscribe((result: RouterEvent) => {
      if(result instanceof ChildActivationEnd) {
        if(result['snapshot']) {
          this.refresh(result['snapshot'].queryParams['operator'] != null ? result['snapshot'].queryParams['operator'] : 'Hibiscus')
        }
      }
    })

    this.transitionSubscription = this.transitioner.transition
      .subscribe(() => {
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

    this.operator = null; // destroy all components so they refresh
    
    setTimeout(() => {
      this.operator = this.database.operators[this.database.operators.findIndex(operator => encodeURIComponent(operator.name.toLowerCase()) == newOperator.toLowerCase())];
      console.log(this.operator)
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

  ngOnDestroy() {
    this.transitionSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

}
