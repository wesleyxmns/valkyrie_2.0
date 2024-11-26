import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePresets } from '@/data/zustands/use-preset-store'
import { useAuth } from '@/hooks/auth/use-auth'
import { datasheetAPI } from '@/lib/fetch/datasheet-api'
import { avoidDefaultDomBehavior } from '@/shared/functions/avoidDefaultDomBehavior'

interface NewContent {
  name: string
  type?: 'folder' | 'item'
}

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['folder', 'item']).optional(),
})

export function AddNewContentDialog({ ...props }) {
  const { createFolder, createItem } = usePresets()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewContent>({
    resolver: zodResolver(schema),
  })
  async function createItemInDatasheet(item: NewContent) {
    const preset = {
      code: item.name,
      content: [],
      tags: [],
      paths: [...props.paths, props.name],
      created_By: user && user.getDisplayName(),
    }

    const res = await datasheetAPI(`/v1/preset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(preset),
    })
    if (res.status !== 201) {
      throw new Error('Error creating item in datasheet')
    } else {
      const item = await res.json()
      createItem({ parentId: props.id, item })
    }
  }

  const handleAddContent = async (data: NewContent) => {
    if (props.id === null) {
      createFolder(null, data.name)
    } else if (data.type === 'folder') {
      createFolder(props.id, data.name)
    } else if (data.type === 'item') {
      createItemInDatasheet(data)
    }
    reset()
    setIsOpen(false)
  }
  const handleUpperCaseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.toUpperCase()
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} >
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent onPointerDownOutside={avoidDefaultDomBehavior} onInteractOutside={avoidDefaultDomBehavior} className="w-96" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {props.id === null
            ? 'Adicionar uma nova pasta raíz'
            : 'Escolha adicionar uma nova pasta ou item'}
        </DialogDescription>
        <form onSubmit={handleSubmit(handleAddContent)}>
          <Input
            id="contentName"
            placeholder="Name"
            className="mb-4"
            {...register('name')}
            onInput={handleUpperCaseInput}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}

          {props.id !== null && (
            <div className="mb-4">
              <label className="block mb-2">Tipo:</label>
              <select
                {...register('type')}
                className="w-full p-2 border rounded"
              >
                <option value="folder">Pasta</option>
                <option value="item">Item</option>
              </select>
            </div>
          )}

          <Button type="submit" className="w-full">
            Adicionar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
