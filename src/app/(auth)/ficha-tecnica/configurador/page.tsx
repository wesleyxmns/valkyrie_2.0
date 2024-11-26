'use client'
import { Header } from "@/components/modules/dashboard/main-area-header";
import { AddNewContentDialog } from "@/components/modules/datasheet/configurador/add-new-content-dialog";
import { MultiSelectCustomDti } from "@/components/modules/datasheet/configurador/multi-select-custom-dti";
import { TreeView } from "@/components/modules/datasheet/configurador/tree-view";
import { Button } from "@/components/ui/button";
import { usePresets } from "@/data/zustands/use-preset-store";
import { datasheetAPI } from "@/lib/fetch/datasheet-api";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface PresetConfiguratorProps {
  className?: string,
  variant?: 'configurator' | 'form'
}

export default function PresetConfigurator({ variant = 'configurator', className }: PresetConfiguratorProps) {

  const { presets, builderPresetModel, createItem, updateNode } = usePresets()

  const [searchTags, setSearchTags] = useState<string[]>([])

  const getAllPresets = async () => {
    const res = await datasheetAPI('/v1/preset', { method: 'GET' })
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    const jsonData = await res.json()
    builderPresetModel(jsonData)
  }

  const filterSearchTags = async () => {
    const res = await datasheetAPI(
      `/v1/preset/tags?tags=${searchTags.join(',')}`,
      {
        method: 'GET',
      },
    )
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    const jsonData = await res.json()
    builderPresetModel(jsonData)
  }

  useEffect(() => {
    if (searchTags.length > 0) {
      filterSearchTags()
    } else {
      getAllPresets()
    }
  }, [searchTags, createItem, updateNode])

  return (
    <div className="h-full w-full mt-20">
      <Header>
        <Header.H1>
          Configurador
        </Header.H1>
      </Header>
      <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
        <div className={twMerge('mt-2 w-full h-full z-0 hover:z-50', className)}>
          <div className="flex items-center gap-5">
            <MultiSelectCustomDti onChange={(e) => setSearchTags(e)} />
            {variant === 'configurator' &&
              <AddNewContentDialog id={null} title={`Adicionar`}>
                <Button>Adicionar Pasta Raiz</Button>
              </AddNewContentDialog>
            }
          </div>
          <TreeView
            expandAll
            data={presets}
          />
        </div>
      </div>
    </div>
  )
}
