/* eslint-disable @typescript-eslint/no-unused-vars */
import { createFileNode } from '@/components/modules/datasheet/configurador/create-file-node'
import { createFolderNode } from '@/components/modules/datasheet/configurador/create-folder-node'
import { ContentItemProps, TreeDataItem } from '@/components/modules/datasheet/configurador/tree-view'
import { create } from 'zustand'
import { addItemToParent } from './helpers/add-item-to-parent'
import { findItemPaths } from './helpers/find-item-paths'

// Types
export interface Data {
  id: number
  code: string
  description: string
  paths?: string[]
  tags?: string[]
  attachments?: string[]
  content?: ContentItemProps[]
}

interface CreateItemProps {
  parentId: string
  item: Data
}

interface PresetState {
  dataPreset: Data[]
  presets: TreeDataItem[]
  newPresets: TreeDataItem[]
  rawData: Data[]
  isLoading: boolean
  error: Error | null
  builderPresetModel: (dataArray: Data[]) => TreeDataItem[]
  setPresets: (presets: TreeDataItem[]) => void
  setRawData: (dataPreset: Data[]) => void
  createFolder: (parentId: string | null, name: string) => void
  createItem: ({ parentId, item }: CreateItemProps) => void
  updateNode: (nodeId: string, updates: Partial<TreeDataItem>) => void
}

// Zustand store
const usePresetStore = create<PresetState>((set, get) => ({
  presets: [],
  newPresets: [],
  rawData: [],
  isLoading: false,
  error: null,
  dataPreset: [],

  builderPresetModel: (dataArray: Data[]): TreeDataItem[] => {
    const rootNodes: TreeDataItem[] = []

    function findOrCreateNode(paths: string[]): TreeDataItem {
      let currentNode: TreeDataItem | undefined
      let currentPath: string[] = []

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        currentPath = paths.slice(0, i)

        if (!currentNode) {
          currentNode = rootNodes.find((node) => node.name === path)
          if (!currentNode) {
            currentNode = createFolderNode(path)
            rootNodes.push(currentNode)
          }
        } else {
          let childNode = currentNode.children?.find(
            (child) => child.name === path,
          )
          if (!childNode) {
            childNode = createFolderNode(path, currentPath)
            currentNode.children = currentNode.children || []
            currentNode.children.push(childNode)
          }
          currentNode = childNode
        }
      }

      return currentNode!
    }

    for (const data of dataArray) {
      if (data.paths && data.paths.length > 0) {
        const fullPath = data.paths
        const parentNode = findOrCreateNode(fullPath)
        const fileNode = createFileNode(data, fullPath)
        parentNode.children = parentNode.children || []
        parentNode.children.push(fileNode)
      }
    }

    set({ presets: rootNodes, rawData: dataArray })
    return rootNodes
  },

  setPresets: (presets: TreeDataItem[]) => set({ presets }),
  setRawData: (dataPreset: Data[]) => set({ dataPreset }),

  createFolder: (parentId: string | null, name: string) => {
    set((state) => {
      const newFolder = createFolderNode(
        name,
        parentId ? [...findItemPaths(state.presets, parentId)] : [],
      )

      const updateTree = (tree: TreeDataItem[]): TreeDataItem[] => {
        if (parentId) {
          return addItemToParent(tree, parentId, newFolder)
        } else {
          return [...tree, newFolder]
        }
      }

      return {
        presets: updateTree(state.presets),
        newPresets: updateTree(state.newPresets),
      }
    })
  },

  createItem: ({ parentId, item }: CreateItemProps) => {
    set((state) => {
      const newItem = createFileNode(
        item,
        [...findItemPaths(state.presets, parentId)],
      )

      const updateTree = (tree: TreeDataItem[]): TreeDataItem[] => {
        return addItemToParent(tree, parentId, newItem)
      }

      return {
        presets: updateTree(state.presets),
        newPresets: updateTree(state.newPresets),
      }
    })
  },

  updateNode: (nodeId: string, updates: Partial<TreeDataItem>) => {
    set((state) => {
      const updateTreeNode = (items: TreeDataItem[]): TreeDataItem[] => {
        return items.map((item) => {
          if (item.id === nodeId) {
            const updatedItem = { ...item, ...updates }

            if (updatedItem.children && updates.name) {
              const oldName = item.name
              const newName = updates.name

              const updateDescendantPaths = (
                node: TreeDataItem,
              ): TreeDataItem => {
                const newPaths = node.paths
                  ? node.paths.map((path) =>
                    path === oldName ? newName : path,
                  )
                  : [newName]

                return {
                  ...node,
                  paths: newPaths,
                  children: node.children?.map(updateDescendantPaths),
                }
              }

              updatedItem.children = updatedItem.children.map(
                updateDescendantPaths,
              )
            }

            return updatedItem
          }
          if (item.children) {
            return {
              ...item,
              children: updateTreeNode(item.children),
            }
          }
          return item
        })
      }

      return {
        presets: updateTreeNode(state.presets),
        newPresets: updateTreeNode(state.newPresets),
      }
    })
  },
}))

export function usePresets() {
  const {
    builderPresetModel,
    presets,
    newPresets,
    isLoading,
    error,
    createFolder,
    createItem,
    updateNode,
    setRawData,
    rawData,
  } = usePresetStore()

  return {
    builderPresetModel,
    presets,
    newPresets,
    isLoading,
    error,
    createFolder,
    createItem,
    updateNode,
    setRawData,
    rawData,
  }
}
