import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemPageRoutingModule } from './item-routing.module';

import { ItemPage } from './item.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ItemComponent } from 'src/app/shared/item/item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemPageRoutingModule,
    DialogModule,
    DynamicDialogModule,
    SharedModule
  ],
  declarations: [
    ItemPage,
  ]
})
export class ItemPageModule {}
