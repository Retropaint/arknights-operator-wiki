export interface Item {
  name: string;
  id: string;
  imgId: string;
  rarity: number;
  amount?: number;
  type?: string;
}

export interface ItemCategory {
  name: string;
  items?: Item[];

  find: string; // word(s) to find item of this category
  lowerCase?: boolean; // some items might only have the lowercase versions of whatever is assigned to 'find'
}