'use client'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { useConfigurator } from '@/hooks/use-configurator/use-configurator'
import { avoidDefaultDomBehavior } from '@/shared/functions/avoidDefaultDomBehavior'
import { Archive, Eye } from 'lucide-react'
import { FaRegClone } from "react-icons/fa6"
import { PresetForm } from './preset-form'

export function PreviewContentDialog({ ...props }) {
  const {
    isOpen,
    setIsOpen,
    currentPage,
    handleClonePreset,
    handleArchivePreset,
  } = useConfigurator({ ...props })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className='flex items-center space-x-2' >
        {currentPage === '/ficha-tecnica/configurador' && <Eye className="h-4 w-4 shrink-0" />}
      </DialogTrigger>
      <button onClick={handleClonePreset} >
        {currentPage === '/ficha-tecnica/configurador' && <FaRegClone className="h-4 w-4 shrink-0" />}
      </button>
      <button onClick={handleArchivePreset} >
        {currentPage === '/ficha-tecnica/configurador' && <Archive className="h-4 w-4 shrink-0" />}
      </button>
      <DialogContent
        onPointerDownOutside={avoidDefaultDomBehavior}
        onInteractOutside={avoidDefaultDomBehavior}
        className="max-w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        <PresetForm {...props} />
      </DialogContent>
    </Dialog >
  )
}
