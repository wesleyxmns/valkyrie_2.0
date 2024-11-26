'use client';
import { MultiSelectContext } from "@/contexts/multi-select/multi-select-context"
import { multiSelectReducer } from "@/lib/reducers/multi-select-reducer"
import { MultiSelectState } from "@/shared/types/multiselect-state"
import { useReducer } from "react"

const initialState: MultiSelectState = {
  isOpen: false,
  selectedOptions: [],
  searchTerm: '',
  currentPhrase: [],
  currentProduct: null,
  products: [],
  otherLabels: [],
  productNumbersMap: {},
}

export const MultiSelectProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {

  const [state, dispatch] = useReducer(multiSelectReducer, initialState)

  return (
    <MultiSelectContext.Provider value={{ state, dispatch }}>
      {children}
    </MultiSelectContext.Provider>
  )
}
