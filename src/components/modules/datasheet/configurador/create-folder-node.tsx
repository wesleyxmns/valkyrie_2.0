import { TreeDataItem } from '@/components/modules/datasheet/configurador/tree-view'
import { Folder, FolderOpen } from 'lucide-react'
import { v4 as uuidV4 } from 'uuid'
import { ActionFolder } from './actions'

export function createFolderNode(
  name: string,
  parentPaths: string[] = [],
): TreeDataItem {
  const defaultFolder = {
    id: uuidV4(),
    name,
    children: [],
    icon: Folder,
    openIcon: FolderOpen,
    paths: parentPaths,
  }
  return {
    ...defaultFolder,
    actions: <ActionFolder {...defaultFolder} />,
  }
}
