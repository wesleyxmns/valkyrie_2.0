import { MultiSelectContext } from '@/contexts/multi-select/multi-select-context';
import { useContext } from 'react';

export const useMultiSelect = () => {
  const context = useContext(MultiSelectContext)
  if (!context) {
    throw new Error('useMultiSelect must be used within a MultiSelectProvider')
  }
  return context
}
