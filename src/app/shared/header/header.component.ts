import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { DialogAboutComponent } from 'src/app/dialogs/dialog-about/dialog-about.component';
import { DialogSettingsComponent } from 'src/app/dialogs/dialog-settings/dialog-settings.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  favIcon!: HTMLLinkElement;
  isBlurry: boolean = false;

  toggledDialogSubscription: Subscription;

  constructor(
    private title: Title,
    private dialogService: DialogService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.toggledDialogSubscription = this.sharedService.toggledDialog
      .subscribe(result => {
        this.isBlurry = result;
      })
  }

  mainPageFaviconAndTitle() {
    this.favIcon = <HTMLLinkElement>document.getElementById('appIcon');
    this.title.setTitle('Retropaint\'s Arknights Wiki');
    this.favIcon.href = 'assets/icon/favicon.png';
  }

  openSettingsModal() {
    this.openDialog(DialogSettingsComponent)
  }
  
  openAboutModal() {
    this.openDialog(DialogAboutComponent)
  }

  openDialog(component: any) {
    this.sharedService.toggleDialog(true);
    this.dialogService.open(component, {
      dismissableMask: true,
      transitionOptions: '0ms',
      maskStyleClass: 'modal-background',
    })
    .onClose.subscribe(() => {
      this.sharedService.toggleDialog(false);
    })
  }

}
