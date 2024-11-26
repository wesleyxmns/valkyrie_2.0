'use client'
import { usePresets } from '@/data/zustands/use-preset-store'
import { datasheetAPI } from '@/lib/fetch/datasheet-api'
import { useEffect, useState } from 'react'
import { MultiSelectCustom } from '../multi-select-custom'

export function MultiSelectCustomDti({
  onChange,
}: {
  onChange: (value: string[]) => void
}) {

  const [options, setOptions] = useState([])
  const { presets } = usePresets()

  const getAllTags = async () => {
    const res = await datasheetAPI('/v1/tag', { method: 'GET' })
    try {
      const data = await res.json()
      setOptions(data.map((tag) => tag.name))
    } catch (error) {
      throw new Error('Failed to fetch tags')
    }
  }

  const handleChange = (values) => {
    onChange(values.map((value: string) => value.replaceAll(' ', '')))
  }

  useEffect(() => {
    getAllTags()
  }, [presets])

  return (
    <MultiSelectCustom
      options={options}
      onChange={handleChange}
    />
  )
}
