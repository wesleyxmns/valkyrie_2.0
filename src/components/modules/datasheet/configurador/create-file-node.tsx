import { Data } from '@/data/zustands/use-preset-store'
import { ActionFile } from './actions'
import { ContentItemProps, TreeDataItem } from './tree-view'

export function createFileNode(
  data: Data,
  parentPaths: string[],
): TreeDataItem {
  const defaultFileNode = {
    id: String(data.id),
    name: data.code,
    code: data.code,
    description: data.description,
    tags: data.tags,
    content: data.content as unknown as ContentItemProps[],
    attachments: data.attachments,
    paths: [...parentPaths],
  }
  return {
    ...defaultFileNode,
    actions: <ActionFile {...defaultFileNode} />,
  }
}
