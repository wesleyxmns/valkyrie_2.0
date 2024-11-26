'use client'
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useAuth } from "../auth/use-auth"
import { usePresets } from "@/data/zustands/use-preset-store"
import { datasheetAPI } from "@/lib/fetch/datasheet-api"
import { HttpStatus } from "@/lib/fetch/constants/http-status"
import { protheusAPI } from "@/lib/fetch/protheus-api"

interface TreeDataItem {
  id: string
  name: string
  description: string
  content: Array<{ code: string; quantity: string; description: string }>
  tags?: string[]
  productTags?: string[]
  attachments?: string[]
  paths?: string[]
}

type Tag = {
  name: string,
  created_at: Date,
  id: number
}

export function useConfigurator({ ...props }) {

  const { user } = useAuth()

  const currentPage = usePathname()

  const initialData = props

  const form = useForm<TreeDataItem>({
    defaultValues: initialData,
  })

  const { updateNode, builderPresetModel } = usePresets()
  const { register, control, watch, setValue, getValues, handleSubmit, reset, } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'content',
  })

  const [newTag, setNewTag] = useState('')
  const [newProductTag, setNewProductTag] = useState('')
  const [isChanged, setIsChanged] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [updatedFields, setUpdatedFields] = useState<Record<string, any>>(initialData)
  const [tagsCreated, setTagsCreated] = useState<Tag[]>([])

  const [localStandardTags, setLocalStandardTags] = useState<string[]>([])
  const [localProductTags, setLocalProductTags] = useState<string[]>([])

  const watchedFields = watch()
  const productTags = [
    ...(watchedFields.tags?.filter((tag) => tag.includes('=')) || []),
    ...(watchedFields.productTags || []),
  ]

  const standardTags = watchedFields.tags?.filter((tag) => !tag.includes('='))

  useEffect(() => {
    const isDataChanged =
      JSON.stringify(watchedFields) !== JSON.stringify(initialData)
    setIsChanged(isDataChanged)
    if ((newTag.length > 0 || newProductTag.length > 0) && tagsCreated.length === 0) {
      getTagsCreated()
    }
  }, [watchedFields, initialData])

  useEffect(() => {
    setLocalStandardTags(tagsCreated.filter(tag => !tag.name.includes('=')).map(tag => tag.name))
    setLocalProductTags(tagsCreated.filter(tag => tag.name.includes('=')).map(tag => tag.name))
  }, [tagsCreated])

  async function getTagsCreated() {
    const response = await datasheetAPI('/v1/tag', { method: 'GET' })
    const result = await response.json()
    if (response.status === HttpStatus.OK) {
      setTagsCreated(result)
    }
    return null;
  }

  const handleAddTag = () => {
    if (newTag && !watchedFields.tags?.includes(newTag)) {
      const upperTag = newTag.toUpperCase()
      setValue('tags', [...(watchedFields.tags || []), upperTag])
      if (!localStandardTags.includes(upperTag)) {
        setLocalStandardTags(prev => [...prev, upperTag])
      }
      setNewTag('')
    }
  }

  const handleAddProductTag = () => {
    const productTagRegex = /^[A-Z]+=[0-9]+$/
    if (
      newProductTag &&
      productTagRegex.test(newProductTag) &&
      !watchedFields.productTags?.includes(newProductTag)
    ) {
      const upperTag = newProductTag.toUpperCase()
      setValue('productTags', [
        ...(watchedFields.productTags || []),
        upperTag,
      ])
      if (!localProductTags.includes(upperTag)) {
        setLocalProductTags(prev => [...prev, upperTag])
      }
      setNewProductTag('')
    } else {
      toast.info('Formato de tag inválido, (ex: PRODUTO=QUANTIDADE)', {
        position: 'top-center'
      })
    }
  }

  const handleRemoveTag = (
    tagToRemove: string,
    tagType: 'standard' | 'product',
  ) => {
    if (tagType === 'standard') {
      setValue(
        'tags',
        (watchedFields.tags || []).filter((tag) => tag !== tagToRemove),
      )
    } else {
      setValue(
        'productTags',
        (watchedFields.productTags || []).filter((tag) => tag !== tagToRemove),
      )
    }
  }

  const handleUpperCaseInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.toUpperCase()
  }

  async function getProductDescription(code: string, index: number) {
    let description = ''
    const response = await protheusAPI(`/product?product=${code}`)
    if (response.status === HttpStatus.OK) {
      description = await response.text()
    }
    return description
  }

  async function handleClonePreset() {
    const body = JSON.stringify({
      presetId: watchedFields.id,
      username: user && user?.getDisplayName()
    })

    const response = await datasheetAPI(`/v1/preset/clone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    })

    if (response.status === HttpStatus.OK) {
      const res = await datasheetAPI('/v1/preset', { method: 'GET' })
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      const jsonData = await res.json()
      builderPresetModel(jsonData)
    }
  }

  async function handleArchivePreset() {
    const response = await datasheetAPI(`/v1/preset/${watchedFields.id}/archive`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (response.status === HttpStatus.NO_CONTENT) {
      const res = await datasheetAPI('/v1/preset', { method: 'GET' })
      if (!res.ok) {
        throw new Error('Failed to fetch data')
      }
      const jsonData = await res.json()
      builderPresetModel(jsonData)
    }
  }

  const onSubmit = async (data: TreeDataItem) => {
    const updateData = {
      id: Number(data.id),
      code: data.name,
      description: data.description || '',
      tags: [...data.tags ?? [], ...data.productTags ?? []],
      attachments: data.attachments || [],
      content: data.content,
      paths: data.paths || [],
    }

    try {
      const { status } = await datasheetAPI(`/v1/preset/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      if (status === 200) {
        updateNode(data.id, data)
        reset(data)
        toast.success('Template atualizado com sucesso')
      }
    } catch (error) {
      throw new Error('Failed to update the node data')
    }
  }

  return {
    isOpen,
    setIsOpen,
    currentPage,
    register,
    control,
    getValues,
    setValue,
    append,
    remove,
    handleSubmit,
    handleUpperCaseInput,
    onSubmit,
    fields,
    getProductDescription,
    updatedFields,
    setUpdatedFields,
    standardTags,
    getTagsCreated,
    handleAddProductTag,
    handleClonePreset,
    handleRemoveTag,
    handleArchivePreset,
    localStandardTags,
    newTag,
    setNewTag,
    handleAddTag,
    watchedFields,
    productTags,
    localProductTags,
    newProductTag,
    setNewProductTag,
    isChanged,
  }
}