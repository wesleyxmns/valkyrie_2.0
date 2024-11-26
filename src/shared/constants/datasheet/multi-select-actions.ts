import { MultiSelectActionTypes } from "@/shared/enums/datasheet-enums/multi-select-actions"
import { MultiSelectOP } from "@/shared/interfaces/multi-select-op"
import { MultiSelectAction } from "@/shared/types/multi-select-actions"

export const toggleDropdown = (): MultiSelectAction => ({
  type: MultiSelectActionTypes.TOGGLE_DROPDOWN,
})

export const setSearchTerm = (term: string): MultiSelectAction => ({
  type: MultiSelectActionTypes.SET_SEARCH_TERM,
  payload: term,
})

export const addSelectedOption = (option: string): MultiSelectAction => ({
  type: MultiSelectActionTypes.ADD_SELECTED_OPTION,
  payload: option,
})

export const removeSelectedOption = (option: string): MultiSelectAction => ({
  type: MultiSelectActionTypes.REMOVE_SELECTED_OPTION,
  payload: option,
})

export const setCurrentPhrase = (phrase: string[]): MultiSelectAction => ({
  type: MultiSelectActionTypes.SET_CURRENT_PHRASE,
  payload: phrase,
})

export const setCurrentProduct = (
  product: string | null,
): MultiSelectAction => ({
  type: MultiSelectActionTypes.SET_CURRENT_PRODUCT,
  payload: product,
})

export const processNumericPhrase = (
  product: string,
  operator: string,
  value: string,
) => ({
  type: MultiSelectActionTypes.PROCESS_NUMERIC_PHRASE as const,
  payload: { product, operator, value },
})
export const initializeData = (
  products: MultiSelectOP[],
  otherLabels: MultiSelectOP[],
  productNumbersMap: Record<string, string[]>,
): MultiSelectAction => ({
  type: MultiSelectActionTypes.INITIALIZE_DATA,
  payload: { products, otherLabels, productNumbersMap },
})

export const resetPhrase = (): MultiSelectAction => ({
  type: MultiSelectActionTypes.RESET_PHRASE,
})
