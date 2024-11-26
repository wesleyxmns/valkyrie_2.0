import { Plus } from 'lucide-react'
import { AddNewContentDialog } from './add-new-content-dialog'
import { PreviewContentDialog } from './preview-content-dialog'

export function ActionFolder({ ...props }) {
  return (
    <div className="flex gap-5">
      <AddNewContentDialog {...props}>
        <Plus className="h-4 w-4 shrink-0" />
      </AddNewContentDialog>
    </div>
  )
}

export function ActionFile({ ...props }) {
  return (
    <div className="flex gap-5">
      <PreviewContentDialog {...props} />
    </div>
  )
}