import { TreeDataItem } from "@/components/modules/datasheet/configurador/tree-view"

export function findItemPaths(items: TreeDataItem[], itemId: string): string[] {
  for (const item of items) {
    if (item.id === itemId) {
      return [...(item.paths || []), item.name]
    }
    if (item.children) {
      const path = findItemPaths(item.children, itemId)
      if (path.length > 0) {
        return path
      }
    }
  }
  return []
}
