import { useMultiSelect } from '@/hooks/multi-select/multi-select'
import { NumberItem } from './number-item'
import { addSelectedOption, resetPhrase } from '@/shared/constants/datasheet/multi-select-actions'

export function ProductNumberList() {
  const { state, dispatch } = useMultiSelect()

  return (
    <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-1 shadow-md max-h-60 overflow-auto">
      {(state.productNumbersMap[state.currentProduct!] || []).map((number) => (
        <NumberItem
          key={number}
          number={number}
          onClick={() => {
            const fullPhrase = [...state.currentPhrase, number].join(' ')
            dispatch(addSelectedOption(fullPhrase))
            dispatch(resetPhrase())
          }}
        />
      ))}
    </div>
  )
}
