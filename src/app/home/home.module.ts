import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { StatTableComponent } from './stat-table/stat-table.component';
import { TalentTableComponent } from './talent-table/talent-table.component';
import { PotentialTableComponent } from './potential-table/potential-table.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TalentModalComponent } from '../modals/talent-modal/talent-modal.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    OverlayPanelModule,
    DialogModule,
    DynamicDialogModule
  ],
  declarations: [HomePage, StatTableComponent, PotentialTableComponent, TalentTableComponent, TalentModalComponent]
})
export class HomePageModule {}
