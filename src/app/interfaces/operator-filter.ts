import { Operator } from "./operator";

export interface GeneratedFilter {
  categoryName: string;
  toggles: string[];
}

export interface OperatorDivision {
  name: string;
  operators: Operator[];
}

export interface FilterCategory {
  name: string;
  filters: Filter[];
  isFolded: boolean;

  imgUrl?: string;
  imgUrlSuffix?: string; // constant strings that appear after the variable string, ie '_icon'
}

export interface Filter {
  name: string;
  toggle: boolean;

  iconId?: string;
  associatedClass?: string; // only for branches
  isHighlighted?: boolean;
}