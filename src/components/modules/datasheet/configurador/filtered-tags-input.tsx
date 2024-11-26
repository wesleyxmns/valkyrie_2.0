import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'

interface FilteredTagInputProps {
  existingTags: string[]
  value: string
  labelButton?: string
  onChange: (value: string) => void
  onAddTag: () => void
  onSelectTag: (tag: string) => void
  placeholder?: string
  validateTag?: (tag: string) => boolean
}

export const FilteredTagInput = ({
  existingTags,
  value,
  labelButton,
  onChange,
  onAddTag,
  onSelectTag,
  placeholder,
  validateTag
}: FilteredTagInputProps) => {
  const [filteredTags, setFilteredTags] = useState<string[]>([])
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      const filtered = existingTags.filter(tag =>
        tag.toUpperCase().includes(value.toUpperCase()) &&
        !value.includes(tag)
      )
      setFilteredTags(filtered)
      setIsDropdownVisible(filtered.length > 0)
    } else {
      setFilteredTags([])
      setIsDropdownVisible(false)
    }
  }, [value, existingTags])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTagSelect = (tag: string) => {
    onSelectTag(tag)
    setIsDropdownVisible(false)
  }

  return (
    <div className="grid gap-2" ref={inputRef}>
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            placeholder={placeholder}
            onFocus={() => setIsDropdownVisible(value.length > 0 && filteredTags.length > 0)}
            className='w-full'
          />
          <Button
            type="button"
            onClick={onAddTag}
            disabled={validateTag ? !validateTag(value) : false}
          >
            {labelButton ? labelButton : 'Adicionar'}
          </Button>
        </div>

        {isDropdownVisible && filteredTags.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm">
            <div className="p-2">
              {filteredTags.map((tag, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-sm"
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}