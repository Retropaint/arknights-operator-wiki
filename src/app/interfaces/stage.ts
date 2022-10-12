import { Item } from "./item";

export interface Stage {
  name: string;
  code: string;
  itemDrops: {
    main: Item[],
    side: Item[]
  }
}
