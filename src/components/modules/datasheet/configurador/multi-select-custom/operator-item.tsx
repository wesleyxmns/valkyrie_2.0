import { memo } from 'react'

interface OperatorItemProps {
  op: string
  onClick: (value: string) => void
}
export const OperatorItem = memo(({ op, onClick }: OperatorItemProps) => (
  <div
    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
    onClick={() => onClick(op)}
  >
    {op}
  </div>
))
OperatorItem.displayName = 'OperatorItem'
