import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { StatTableComponent } from './info-tab/stat-table/stat-table.component';
import { TalentTableComponent } from './info-tab/talent-table/talent-table.component';
import { PotentialTableComponent } from './info-tab/potential-table/potential-table.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { SkillTableComponent } from './info-tab/skill-table/skill-table.component';
import { EliteUnlockReqsTableComponent } from './info-tab/elite-unlock-reqs-table/elite-unlock-reqs-table.component';
import { SkillLevelUnlockReqsTableComponent } from './info-tab/skill-level-unlock-reqs-table/skill-level-unlock-reqs-table.component';
import { ItemComponent } from '../shared/item/item.component';
import { RangeGridComponent } from './info-tab/range-grid/range-grid.component';
import { OperatorGalleryComponent } from './info-tab/operator-gallery/operator-gallery.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TabViewModule } from 'primeng/tabview';
import { SearchBoxComponent } from '../shared/search-box/search-box.component';
import { OperatorTransitionerComponent } from './info-tab/operator-transitioner/operator-transitioner.component';
import { ModuleTableComponent } from './info-tab/module-table/module-table.component';
import { OperatorBrieferComponent } from './info-tab/operator-briefer/operator-briefer.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { DialogSettingsComponent } from './dialog-settings/dialog-settings.component';
import { CheckboxComponent } from '../shared/checkbox/checkbox.component';
import { BaseSkillTableComponent } from './info-tab/base-skill-table/base-skill-table.component';
import { ProfileInfoTableComponent } from './profile-tab/profile-info-table/profile-info-table.component';
import { ProfileInfoTextEntriesComponent } from './profile-tab/profile-info-text-entries/profile-info-text-entries.component';
import { DialogueTableComponent } from './dialogue-tab/dialogue-table/dialogue-table.component';
import { TooltipModule } from 'primeng/tooltip';
import { NumberFormatterPipe } from '../pipes/number-formatter.pipe';
import { ProfileTabComponent } from './profile-tab/profile-tab.component';
import { AudioPlayerComponent } from '../shared/audio-player/audio-player.component';
import { SummonTableComponent } from './info-tab/summon-table/summon-table.component';
import { FilterTableComponent } from './filter-table/filter-table.component';
import { OperatorListComponent } from './operator-list/operator-list.component';
import { OperatorItemComponent } from './operator-list/operator-item/operator-item.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    OverlayPanelModule,
    DialogModule,
    DynamicDialogModule,
    AutoCompleteModule,
    TabViewModule,
    NgxImageZoomModule,
    TooltipModule,
    RouterModule
  ],
  declarations: [
    HomePage, 
    StatTableComponent, 
    PotentialTableComponent, 
    TalentTableComponent, 
    SkillTableComponent, 
    EliteUnlockReqsTableComponent,
    SkillLevelUnlockReqsTableComponent,
    ItemComponent,
    RangeGridComponent,
    OperatorGalleryComponent,
    SearchBoxComponent,
    OperatorTransitionerComponent,
    ModuleTableComponent,
    OperatorBrieferComponent,
    DialogSettingsComponent,
    CheckboxComponent,
    BaseSkillTableComponent,
    ProfileInfoTableComponent,
    ProfileInfoTextEntriesComponent,
    DialogueTableComponent,
    AudioPlayerComponent,
    NumberFormatterPipe,
    ProfileTabComponent,
    SummonTableComponent,
    FilterTableComponent,
    OperatorListComponent,
    OperatorItemComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class HomePageModule {}
