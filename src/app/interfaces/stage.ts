import { Item } from "./item";

export interface Stage {
  name: string;
  code: string;
  type: string;
  itemDrops: {
    main: StageItem[],
    side: StageItem[]
  }
}

export interface StageItem extends Item {
  dropType?: number
}