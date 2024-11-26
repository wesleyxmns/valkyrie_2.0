import { memo } from 'react'
interface NumberItemProps {
  number: string
  onClick: (value: string) => void
}
export const NumberItem = memo(({ number, onClick }: NumberItemProps) => (
  <div
    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
    onClick={() => onClick(number)}
  >
    {number}
  </div>
))
NumberItem.displayName = 'NumberItem'
