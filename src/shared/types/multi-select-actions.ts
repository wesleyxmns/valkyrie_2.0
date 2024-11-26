import { MultiSelectActionTypes } from "../enums/datasheet-enums/multi-select-actions";
import { MultiSelectOP } from "../interfaces/multi-select-op";

export type MultiSelectAction =
  | { type: MultiSelectActionTypes.TOGGLE_DROPDOWN }
  | { type: MultiSelectActionTypes.SET_SEARCH_TERM; payload: string }
  | { type: MultiSelectActionTypes.ADD_SELECTED_OPTION; payload: string }
  | { type: MultiSelectActionTypes.REMOVE_SELECTED_OPTION; payload: string }
  | { type: MultiSelectActionTypes.SET_CURRENT_PHRASE; payload: string[] }
  | { type: MultiSelectActionTypes.SET_CURRENT_PRODUCT; payload: string | null }
  | {
    type: MultiSelectActionTypes.INITIALIZE_DATA
    payload: {
      products: MultiSelectOP[]
      otherLabels: MultiSelectOP[]
      productNumbersMap: Record<string, string[]>
    }
  }
  | { type: MultiSelectActionTypes.RESET_PHRASE }
  | {
    type: MultiSelectActionTypes.PROCESS_NUMERIC_PHRASE
    payload: {
      product: string
      operator: string
      value: string
    }
  }