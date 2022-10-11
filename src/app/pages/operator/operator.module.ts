import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonImg } from '@ionic/angular';

import { OperatorPageRoutingModule } from './operator-routing.module';

import { OperatorPage } from './operator.page';
import { StatTableComponent } from './info-tab/stat-table/stat-table.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { NgxImageZoomComponent, NgxImageZoomModule } from 'ngx-image-zoom';
import { BaseSkillTableComponent } from './info-tab/base-skill-table/base-skill-table.component';
import { OperatorGalleryComponent } from './operator-gallery/operator-gallery.component';
import { SkillTableComponent } from './info-tab/skill-table/skill-table.component';
import { ProfileTabComponent } from './profile-tab/profile-tab.component';
import { ProfileInfoTableComponent } from './profile-tab/profile-info-table/profile-info-table.component';
import { ProfileInfoTextEntriesComponent } from './profile-tab/profile-info-text-entries/profile-info-text-entries.component';
import { OperatorBrieferComponent } from './info-tab/operator-briefer/operator-briefer.component';
import { DialogueTableComponent } from './dialogue-tab/dialogue-table/dialogue-table.component';
import { ModuleTableComponent } from './info-tab/module-table/module-table.component';
import { SummonTableComponent } from './info-tab/summon-table/summon-table.component';
import { RangeGridComponent } from './info-tab/range-grid/range-grid.component';
import { EliteUnlockReqsTableComponent } from './info-tab/elite-unlock-reqs-table/elite-unlock-reqs-table.component';
import { SkillLevelUnlockReqsTableComponent } from './info-tab/skill-level-unlock-reqs-table/skill-level-unlock-reqs-table.component';
import { TalentTableComponent } from './info-tab/talent-table/talent-table.component';
import { PotentialTableComponent } from './info-tab/potential-table/potential-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperatorPageRoutingModule,
    SharedModule,
    DialogModule,
    DynamicDialogModule,
    NgxImageZoomModule,
  ],
  declarations: [
    OperatorPage,
    StatTableComponent,
    BaseSkillTableComponent,
    OperatorGalleryComponent,
    SkillTableComponent,
    ProfileTabComponent,
    ProfileInfoTableComponent,
    ProfileInfoTextEntriesComponent,
    OperatorBrieferComponent,
    DialogueTableComponent,
    ModuleTableComponent,
    SummonTableComponent,
    RangeGridComponent,
    EliteUnlockReqsTableComponent,
    SkillLevelUnlockReqsTableComponent,
    TalentTableComponent,
    PotentialTableComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OperatorPageModule {}
