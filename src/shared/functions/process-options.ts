import { v4 as uuidV4 } from 'uuid'
import { MultiSelectOP } from '../interfaces/multi-select-op'

export interface ProcessedOptions {
  products: MultiSelectOP[]
  otherLabels: MultiSelectOP[]
  productNumbersMap: Record<string, string[]>
}

export function processOptions(options: string[]): ProcessedOptions {
  const productSet = new Set<string>()
  const otherLabelsSet = new Set<string>()
  const products: MultiSelectOP[] = []
  const otherLabels: MultiSelectOP[] = []
  const productNumbersMap: Record<string, string[]> = {}

  options.forEach((item) => {
    if (item.includes('=')) {
      const [label, number] = item.split('=')
      if (!productSet.has(label)) {
        productSet.add(label)
        products.push({
          label,
          value: label,
          id: uuidV4(),
        })
      }
      if (productNumbersMap[label] && !!number) {
        productNumbersMap[label].push(number)
      } else {
        if (number) {
          productNumbersMap[label] = [number]
        }
      }
    } else {
      if (!otherLabelsSet.has(item)) {
        otherLabelsSet.add(item)
        otherLabels.push({
          label: item,
          value: item,
          id: uuidV4(),
        })
      }
    }
  })

  return { products, otherLabels, productNumbersMap }
}