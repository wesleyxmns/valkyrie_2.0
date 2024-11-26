import { Badge } from '@/components/ui/badge'
import { OPERATORS } from './operator-list'
import { useMultiSelect } from '@/hooks/multi-select/multi-select'

export function CurrentPhraseList() {
  const { state } = useMultiSelect()
  return (
    <>
      {state.currentPhrase.map((part, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`${OPERATORS.includes(part) && 'bg-amber-300'} ${
            state.products.find((p) => p.value === part) && 'bg-sky-300'
          } mr-1 mb-1`}
        >
          {part}
        </Badge>
      ))}
    </>
  )
}
