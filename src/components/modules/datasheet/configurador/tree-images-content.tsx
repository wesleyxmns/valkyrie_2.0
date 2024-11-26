'use client'
import { Card, CardContent } from "@/components/ui/card"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { DATASHEET_BASE_URL } from "@/config/env/datasheet-base-url"
import { HttpStatus } from "@/lib/fetch/constants/http-status"
import { datasheetAPI } from "@/lib/fetch/datasheet-api"
import { ImagePlus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface FormImagesPreviewProps {
  preset: Record<string, any>
  setPreset: (preview: Record<string, any>) => void
}

export function TreeImagesContent({ preset, setPreset }: FormImagesPreviewProps) {

  useEffect(() => {
    setPreset(preset)
  }, [preset])

  async function handleDelete(idx: number) {
    const newImages = preset.attachments.filter((_, i) => i !== idx)
    const newData = { ...preset, attachments: newImages }

    const result = await datasheetAPI(`/v1/preset/${preset.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    })

    if (result.status === HttpStatus.OK) {
      setPreset(newData)
    }
  }

  async function handleAdd(files: FileList | null) {
    if (!files) return
    const formData = new FormData()
    for (const file of Array.prototype.slice.call(files)) {
      formData.append('image', file)
    }

    try {
      const response = await datasheetAPI(`/v1/preset/add-attachment`, {
        method: 'POST',
        body: formData
      })

      if (response.status === HttpStatus.OK) {
        const newImages = await response.json()
        const updatedData = {
          ...preset,
          description: '',
          attachments: [...preset.attachments, ...newImages]
        }

        await datasheetAPI(`/v1/preset/${preset.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(updatedData)
        })

        setPreset(updatedData)
      }
    } catch (error) {
      throw new Error(`Erro ao adicionar imagens: ${error}`)
    }
  }

  return (
    <div className='ml-2 mr-2 flex space-x-3' >
      <div
        className="border rounded-md p-3 w-10 items-center flex bg-primary text-white cursor-pointer"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <ImagePlus size={25} className="cursor-pointer" />
        <input
          onChange={async (e) => {
            e.preventDefault()
            e.stopPropagation()
            await handleAdd(e.target.files)
          }}
          id="fileInput"
          className="hidden"
          type="file"
        />
      </div>
      <FloatingLabelInput id='Imagens' label='Imagens' >
        <Card>
          <CardContent className='pt-8 min-h-24'>
            <ScrollArea>
              <div className="flex flex-wrap gap-4">
                {preset.attachments?.map((img, idx) => {
                  const imagePath = `${DATASHEET_BASE_URL}/presets/${img}`;
                  return (
                    <div
                      key={img}
                      className="relative w-20 h-20"
                    >
                      <div className="w-full h-full rounded-full border-2 overflow-hidden">
                        <img
                          className="cursor-pointer w-full h-full object-cover mb-0"
                          onClick={() => window.open(imagePath, '_blank')}
                          src={imagePath}
                          alt={img}
                        />
                      </div>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="absolute -top-0 -right-0 bg-red-500 hover:bg-red-600 h-5 w-5 rounded-full flex items-center justify-center p-0"
                      >
                        <Trash2 size={12} className="text-white" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <ScrollBar orientation='vertical' />
            </ScrollArea>
          </CardContent>
        </Card>
      </FloatingLabelInput>
    </div>
  )
}