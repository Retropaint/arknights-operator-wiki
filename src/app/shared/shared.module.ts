import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { OperatorItemComponent } from './operator-item/operator-item.component';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { NumberFormatterPipe } from '../pipes/number-formatter.pipe';
import { RouterModule } from '@angular/router';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ItemComponent } from './item/item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutoCompleteModule,
    RouterModule,
    DialogModule,
    DynamicDialogModule,
  ],
  declarations: [
    HeaderComponent,
    SearchBoxComponent,
    AudioPlayerComponent,
    CheckboxComponent,
    NumberFormatterPipe,
    DialogService,
    OperatorItemComponent,
    ItemComponent
  ],
  exports: [
    HeaderComponent,
    OperatorItemComponent,
    SearchBoxComponent,
    AudioPlayerComponent,
    CheckboxComponent,
    NumberFormatterPipe,
    DialogService,
    ItemComponent
  ],
  schemas: []
})
export class SharedModule {}
