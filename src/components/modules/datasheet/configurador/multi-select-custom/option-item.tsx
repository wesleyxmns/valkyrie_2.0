/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check } from 'lucide-react'
import { memo } from 'react'

interface OptionItemProps {
  option: any
  isSelected: boolean
  onToggle: (value: string) => void
}

export const OptionItem = memo(
  ({ option, isSelected, onToggle }: OptionItemProps) => (
    <div
      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
      onClick={() => onToggle(option.value)}
    >
      <span className="ml-2">{option.label}</span>
      {isSelected && <Check className="ml-auto h-4 w-4" />}
    </div>
  ),
)
OptionItem.displayName = 'OptionItem'
