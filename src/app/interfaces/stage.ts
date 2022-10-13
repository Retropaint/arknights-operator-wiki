import { Item } from "./item";

export interface Stage {
  name: string;
  code: string;
  itemDrops: {
    main: StageItem[],
    side: StageItem[]
  }
}

export interface StageItem extends Item {
  dropChance?: number
}