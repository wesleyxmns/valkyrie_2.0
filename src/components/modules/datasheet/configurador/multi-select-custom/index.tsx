'use client'

import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  addSelectedOption,
  initializeData,
  processNumericPhrase,
  removeSelectedOption,
  setCurrentPhrase,
  setCurrentProduct,
  setSearchTerm,
  toggleDropdown,
} from '../../../../../shared/constants/datasheet/multi-select-actions'

import { OperatorList } from './operator-list'
import { ProductNumberList } from './product-number-list'
import { OptionList } from './option-list'
import { CurrentPhraseList } from './current-phrase-list'
import { SelectedOptions } from './selected-options'
import { processOptions } from '@/shared/functions/process-options'
import { useMultiSelect } from '@/hooks/multi-select/multi-select'

const OPERATORS = ['=']

const MultiSelectContent = ({ options, onChange }) => {
  const { state, dispatch } = useMultiSelect()
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const { otherLabels, productNumbersMap, products } = processOptions(options)
    dispatch(initializeData(products, otherLabels, productNumbersMap))
  }, [options, dispatch])

  const handleToggle = React.useCallback(() => {
    dispatch(toggleDropdown())
    if (!state.isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [dispatch, state.isOpen])

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim()
      dispatch(setSearchTerm(value))

      if (state.otherLabels.find((o) => o.value === value)) {
        dispatch(addSelectedOption(value))
        dispatch(setSearchTerm(''))
      } else if (
        state.currentPhrase.length === 0 &&
        state.products.find((p) => p.value === value)
      ) {
        dispatch(setCurrentPhrase([value]))
        dispatch(setCurrentProduct(value))
        dispatch(setSearchTerm(''))
      } else if (
        state.currentPhrase.length === 1 &&
        OPERATORS.includes(value)
      ) {
        dispatch(setCurrentPhrase([...state.currentPhrase, value]))
        dispatch(setSearchTerm(''))
      } else if (state.currentPhrase.length === 2 && state.currentProduct) {
        const validNumbers = state.productNumbersMap[state.currentProduct] || []
        if (validNumbers.includes(value)) {
          dispatch(
            processNumericPhrase(
              state.currentProduct,
              state.currentPhrase[1],
              value,
            ),
          )
        }
      }
    },
    [state, dispatch],
  )
  const handleOptionToggle = React.useCallback(
    (value: string) => {
      const product = state.products.find((p) => p.value === value)
      if (product) {
        dispatch(setCurrentPhrase([value]))
        dispatch(setCurrentProduct(product.label))
        dispatch(setSearchTerm(''))
      } else {
        if (state.otherLabels.find((o) => o.value === value)) {
          dispatch(setSearchTerm(''))
        }
        dispatch(
          state.selectedOptions.includes(value)
            ? removeSelectedOption(value)
            : addSelectedOption(value),
        )
      }
    },
    [state, dispatch],
  )
  React.useEffect(() => {
    onChange(state.selectedOptions)
  }, [state.selectedOptions])

  const handleInputKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && state.searchTerm) {
        e.preventDefault()
        const _option = [...state.products, ...state.otherLabels].find(
          (option) =>
            option.label.toLowerCase() === state.searchTerm.toLowerCase(),
        )
        if (_option) {
          handleOptionToggle(_option.value)
        }
      } else if (e.key === 'Backspace' && state.searchTerm === '') {
        e.preventDefault()
        if (state.currentPhrase.length > 0) {
          dispatch(setCurrentPhrase(state.currentPhrase.slice(0, -1)))
          if (state.currentPhrase.length === 1) {
            dispatch(setCurrentProduct(null))
          }
        } else if (state.selectedOptions.length > 0) {
          const lastOption =
            state.selectedOptions[state.selectedOptions.length - 1]
          dispatch(removeSelectedOption(lastOption))
        }
      }
    },
    [state, dispatch, handleOptionToggle],
  )

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'flex flex-wrap items-center gap-1 p-2 rounded-md border',
          state.isOpen && 'ring-2 ring-ring ring-offset-2',
          state.selectedOptions.length === 0 &&
          state.currentPhrase.length === 0 &&
          !state.isOpen &&
          'h-10',
        )}
        onClick={handleToggle}
      >
        <SelectedOptions />
        <CurrentPhraseList />
        {state.isOpen && (
          <Input
            ref={inputRef}
            type="text"
            value={state.searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="flex-grow w-80 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={
              state.currentPhrase.length === 0
                ? 'Selecione'
                : state.currentPhrase.length === 1
                  ? 'Adicione o operador (>, <, =, >=, <=)'
                  : 'Digite um número válido'
            }
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {!state.isOpen &&
          state.selectedOptions.length === 0 &&
          state.currentPhrase.length === 0 && (
            <span className="text-muted-foreground">Selecione as opções</span>
          )}
      </div>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={state.isOpen}
        className="absolute right-0 top-0 h-full px-3 py-2"
        onClick={handleToggle}
      >
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {state.isOpen && state.currentPhrase.length === 0 && (
        <OptionList onOptionToggle={handleOptionToggle} />
      )}
      {state.isOpen && state.currentPhrase.length === 1 && <OperatorList />}
      {state.isOpen &&
        state.currentPhrase.length === 2 &&
        state.currentProduct && <ProductNumberList />}
    </div>
  )
}

export interface MultiSelectCustomProps {
  options: string[]
  onChange: (selectedValues: string[]) => void
}

export function MultiSelectCustom({
  options,
  onChange,
}: MultiSelectCustomProps) {
  return <MultiSelectContent options={options} onChange={onChange} />
}
