import { MultiSelectActionTypes } from "@/shared/enums/datasheet-enums/multi-select-actions"
import { MultiSelectAction } from "@/shared/types/multi-select-actions"
import { MultiSelectState } from "@/shared/types/multiselect-state"

export const multiSelectReducer = (
  state: MultiSelectState,
  action: MultiSelectAction,
): MultiSelectState => {
  switch (action.type) {
    case MultiSelectActionTypes.TOGGLE_DROPDOWN:
      return {
        ...state,
        isOpen: !state.isOpen,
      }
    case MultiSelectActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      }
    case MultiSelectActionTypes.ADD_SELECTED_OPTION:
      return {
        ...state,
        selectedOptions: [...state.selectedOptions, action.payload],
      }
    case MultiSelectActionTypes.REMOVE_SELECTED_OPTION:
      return {
        ...state,
        selectedOptions: state.selectedOptions.filter(
          (option) => option !== action.payload,
        ),
      }
    case MultiSelectActionTypes.SET_CURRENT_PHRASE:
      return {
        ...state,
        currentPhrase: action.payload,
      }
    case MultiSelectActionTypes.SET_CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
      }
    case MultiSelectActionTypes.INITIALIZE_DATA:
      return {
        ...state,
        ...action.payload,
      }
    case MultiSelectActionTypes.RESET_PHRASE:
      return {
        ...state,
        currentPhrase: [],
        currentProduct: null,
        searchTerm: '',
      }
    case MultiSelectActionTypes.PROCESS_NUMERIC_PHRASE: {
      const { product, operator, value } = action.payload
      const numbers = state.productNumbersMap[product] || []
      let selectedNumbers: string[] = []

      if (operator === '>' || operator === '>=') {
        selectedNumbers = numbers.filter(
          (num) => parseFloat(num) > parseFloat(value),
        )
      } else if (operator === '<' || operator === '<=') {
        selectedNumbers = numbers.filter(
          (num) => parseFloat(num) < parseFloat(value),
        )
      } else if (operator === '=') {
        selectedNumbers = numbers.filter((num) => num === value)
      }

      const newOptions = selectedNumbers.map((num) => `${product}=${num}`)
      return {
        ...state,
        selectedOptions: [...state.selectedOptions, ...newOptions],
        currentPhrase: [],
        currentProduct: null,
        searchTerm: '',
      }
    }
    default:
      return state
  }
}