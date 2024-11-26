import { useMultiSelect } from '@/hooks/multi-select/multi-select'
import { OptionItem } from './option-item'

interface OptionListProps {
  onOptionToggle: (value: string) => void
}
export function OptionList({ onOptionToggle }: OptionListProps) {
  const { state } = useMultiSelect()
  const filteredOptions = [...state.products, ...state.otherLabels].filter(
    (option) =>
      option.label.toLowerCase().includes(state.searchTerm.toLowerCase()),
  )

  return (
    <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover p-1 shadow-md max-h-60 overflow-auto">
      {filteredOptions.length === 0 ? (
        <div className="py-2 px-2 text-sm text-muted-foreground">
          No options found
        </div>
      ) : (
        filteredOptions.map((option) => (
          <OptionItem
            key={option.id}
            option={option}
            isSelected={state.selectedOptions.includes(option.value)}
            onToggle={onOptionToggle}
          />
        ))
      )}
    </div>
  )
}
