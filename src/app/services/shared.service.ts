import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { GeneratedFilter } from '../interfaces/operator-filter';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  operatorListRefreshSubscription = new Subject<GeneratedFilter[]>();
  operatorListRefresh = this.operatorListRefreshSubscription.asObservable();

  toggledDialogSubscription = new Subject<boolean>();
  toggledDialog = this.toggledDialogSubscription.asObservable();

  jsonsLoadedSubscription = new Subject<null>();
  jsonsLoaded = this.jsonsLoadedSubscription.asObservable();

  favIcon!: HTMLLinkElement;

  constructor(
    private title: Title
  ) { }

  refreshOperatorList(filter: GeneratedFilter[]) {
    this.operatorListRefreshSubscription.next(filter);
  }

  toggleDialog(toggle: boolean) {
    this.toggledDialogSubscription.next(toggle);
  }

  allJsonsLoaded() {
    this.jsonsLoadedSubscription.next();
  }

  changeTabDisplay(headerName: string, faviconUrl: string) {
    this.favIcon = <HTMLLinkElement>document.getElementById('appIcon');
    this.favIcon.href = faviconUrl;
    this.title.setTitle(headerName + ' | Retro\'s AK Wiki');
  }
}
