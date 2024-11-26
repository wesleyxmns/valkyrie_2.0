import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { removeSelectedOption } from '@/shared/constants/datasheet/multi-select-actions'
import { useMultiSelect } from '@/hooks/multi-select/multi-select'

interface SelectedOptions {
  onRemove: (value: string) => void
}
export function SelectedOptions() {
  const { state, dispatch } = useMultiSelect()

  const handleRemove = (value: string) => {
    dispatch(removeSelectedOption(value))
  }

  return (
    <>
      {state.selectedOptions.map((value) => (
        <Badge key={value} variant="secondary" className="mr-1 mb-1">
          {value}
          <button
            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleRemove(value)
            }}
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </button>
        </Badge>
      ))}
    </>
  )
}
