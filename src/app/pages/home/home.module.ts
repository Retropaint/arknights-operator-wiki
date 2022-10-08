import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ItemComponent } from '../../shared/item/item.component';
import { TabViewModule } from 'primeng/tabview';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { DialogSettingsComponent } from '../../dialogs/dialog-settings/dialog-settings.component';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FilterTableComponent } from '../operator/filter-table/filter-table.component';
import { OperatorListComponent } from '../operator/operator-list/operator-list.component';
import { ItemListComponent } from './items-tab/item-list/item-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    OverlayPanelModule,
    DialogModule,
    DynamicDialogModule,
    TabViewModule,
    NgxImageZoomModule,
    TooltipModule,
    RouterModule,
    SharedModule
  ],
  declarations: [
    HomePage, 
    ItemComponent,
    DialogSettingsComponent,
    FilterTableComponent,
    OperatorListComponent,
    ItemListComponent
  ],
  schemas: []
})
export class HomePageModule {}
