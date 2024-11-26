import { MultiSelectAction } from "@/shared/types/multi-select-actions"
import { MultiSelectState } from "@/shared/types/multiselect-state"
import { createContext } from "react"

export const MultiSelectContext = createContext<{ state: MultiSelectState, dispatch: React.Dispatch<MultiSelectAction> } | null>(null)