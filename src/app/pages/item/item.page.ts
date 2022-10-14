import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, Router, RouterEvent, Scroll } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/interfaces/item';
import { Stage } from 'src/app/interfaces/stage';
import { DatabaseJsonGetterService } from 'src/app/services/database-json-getter.service';
import { DatabaseJsonParserService } from 'src/app/services/database-json-parser.service';
import { DatabaseService } from 'src/app/services/database.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.page.html',
  styleUrls: ['./item.page.scss'],
  providers: [DialogService]
})
export class ItemPage implements OnInit {

  @ViewChild('stageTable') stageTable: ElementRef;

  item: Item;

  stageDrops: {
    code: string;
    type: string;
    dropType: string;
    isGuaranteed: boolean;
  }[] = [];

  stageTableHeight: number = 0;

  jsonsLoadedSubscription: Subscription;
  toggledDialogSubscription: Subscription;
  routerSubscription: Subscription;

  constructor(
    private jsonParser: DatabaseJsonParserService,
    private router: Router,
    private database: DatabaseService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private dbGetter: DatabaseJsonGetterService
  ) { }

  ngOnInit() {
    // refresh page on navigation
    let navigationParams;
    this.routerSubscription = this.router.events.subscribe((result: RouterEvent) => {
      if(result instanceof ChildActivationEnd) {
        navigationParams = result['snapshot'].queryParams['id'];
      } else if(result instanceof Scroll) {

        if(navigationParams != null) {
          this.initItem(navigationParams)
        }

      }
    })

    this.jsonsLoadedSubscription = this.sharedService.jsonsLoaded
      .subscribe(() => {
        const queryParams = this.route.snapshot.queryParams;
        this.initItem(queryParams['id'])
      })
  }

  initItem(itemId: string) {
    this.stageDrops = [];
    this.item = this.jsonParser.getItem(itemId)
    this.getStageDrops();
    this.sharedService.changeTabDisplay(this.item.name, `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/${this.item.imgId}.png`)
    setTimeout(() => {
      this.onResize(null);
    })
  }

  getStageDrops() {
    this.database.stages.forEach(stage => {
      const isMain = stage.itemDrops.main.find(item => item.id == this.item.id)
      const isSide = stage.itemDrops.side.find(item => item.id == this.item.id)

      if(!isMain && !isSide) {
        return;
      }

      let dropType = '';
      if(isMain && isSide) {
        dropType = 'Main & Side';
      } else if(isMain) {
        dropType = 'Main'
      } else if(isSide) {
        dropType = 'Side'
      }

      this.stageDrops.push(
        {
          code: stage.code,
          type: stage.type,
          dropType: dropType,
          isGuaranteed: false
        }
      )
    })

    this.stageDrops.sort((a, b) => (a.type < b.type) ? -1 : 1) 

    // sort by lower chapter branches first
    this.stageDrops.sort((a, b) => {
      if(a.type.includes('Chapter') && a.type.includes('Branch') && b.type.includes('Branch') && b.type.includes('Chapter')) {
        return -1;
      }
      return 0;
    })

    // put chapter branches after main chapter stages
    this.stageDrops.sort((a, b) => {
      if(a.type.includes('Chapter') && b.type.includes('Branch') && b.type.includes('Chapter')) {
        return -1;
      }
      return 0;
    })
  }

  onResize(event) {
    this.stageTableHeight = window.innerHeight - this.stageTable.nativeElement.offsetTop - 80;
  }

}
