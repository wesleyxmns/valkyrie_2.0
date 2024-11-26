import { TreeDataItem } from "@/components/modules/datasheet/configurador/tree-view"

export function addItemToParent(
  items: TreeDataItem[],
  parentId: string,
  newItem: TreeDataItem,
): TreeDataItem[] {
  return items.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...(item.children || []), newItem],
      }
    }
    if (item.children) {
      return {
        ...item,
        children: addItemToParent(item.children, parentId, newItem),
      }
    }
    return item
  })
}
