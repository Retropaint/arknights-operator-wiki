import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ChildActivationEnd, Router, RouterEvent, Scroll } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Operator } from 'src/app/interfaces/operator';
import { DatabaseJsonGetterService } from 'src/app/services/database-json-getter.service';
import { DatabaseService } from 'src/app/services/database.service';
import { OperatorAvatarService } from 'src/app/services/operator-avatar.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.page.html',
  styleUrls: ['./operator.page.scss'],
  providers: [DialogService]
})
export class OperatorPage implements OnInit {

  operator: Operator;
  isFirstLoad: boolean = false;
  currentTab: 'info' | 'gallery' | 'profile' | 'dialogue' = 'info';
  isBlurry: boolean = false;

  jsonsLoadedSubscription: Subscription;
  toggledDialogSubscription: Subscription;
  routerSubscription: Subscription;

  favIcon!: HTMLLinkElement;
  
  constructor(
    public database: DatabaseService,
    public dbGetter: DatabaseJsonGetterService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private opAvatarService: OperatorAvatarService
  ) { }

  ngOnInit() {

    if(this.database.isLoaded) {
      const queryParams = this.route.snapshot.queryParams;
      this.refresh(queryParams.name)
    }

    // refresh page on navigation
    let navigationParams;
    this.routerSubscription = this.router.events.subscribe((result: RouterEvent) => {
      if(result instanceof ChildActivationEnd) {
        navigationParams = result['snapshot'].queryParams['name'];
      } else if(result instanceof Scroll) {

        if(navigationParams != null) {
          this.refresh(navigationParams)
        }

      }
    })

    this.jsonsLoadedSubscription = this.sharedService.jsonsLoaded
      .subscribe(() => {
        const queryParams = this.route.snapshot.queryParams;
        this.refresh(queryParams.name)
      })

    this.toggledDialogSubscription = this.sharedService.toggledDialog
      .subscribe(result => {
        this.isBlurry = result;
      })
  }

  refresh(newOpName: string = null) {

    if(newOpName == null) {
      this.router.navigate(
        ['/main'],
        {
          replaceUrl: true
        }
      )
      return;
    }

    this.operator = null;

    // destroy all components so they refresh
    setTimeout(() => {
      const operatorIndex = this.database.operators.findIndex(operator => encodeURIComponent(operator.name.toLowerCase()) == newOpName.toLowerCase())
      this.operator = this.database.operators[operatorIndex];
      console.log(this.operator)
      setTimeout(() => {
        this.changeTabDisplay();
      })
    })
  }

  changeTabDisplay() {
    this.favIcon = <HTMLLinkElement>document.getElementById('appIcon');
    this.favIcon.href = 'https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/' + this.opAvatarService.getAvatar(this.operator) + '.png';
    this.title.setTitle(this.operator.name + ' | Retro\'s AK Wiki');
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.jsonsLoadedSubscription.unsubscribe();
  }

}
