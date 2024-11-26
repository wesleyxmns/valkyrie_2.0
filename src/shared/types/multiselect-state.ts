import { MultiSelectOP } from "../interfaces/multi-select-op"


export type MultiSelectState = {
  isOpen: boolean
  selectedOptions: string[]
  searchTerm: string
  currentPhrase: string[]
  currentProduct: string | null
  products: MultiSelectOP[]
  otherLabels: MultiSelectOP[]
  productNumbersMap: Record<string, string[]>
}