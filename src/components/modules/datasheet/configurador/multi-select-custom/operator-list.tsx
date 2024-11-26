import { useMultiSelect } from '@/hooks/multi-select/multi-select'
import { OperatorItem } from './operator-item'
import { setCurrentPhrase, setSearchTerm } from '@/shared/constants/datasheet/multi-select-actions'

// export const OPERATORS = ['>', '<', '=', '>=', '<=']
export const OPERATORS = ['=']

export function OperatorList() {
  const { state, dispatch } = useMultiSelect()

  return (
    <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-1 shadow-md">
      {OPERATORS.map((op) => (
        <OperatorItem
          key={op}
          op={op}
          onClick={() => {
            dispatch(setCurrentPhrase([...state.currentPhrase, op]))
            dispatch(setSearchTerm(''))
          }}
        />
      ))}
    </div>
  )
}
