import { BuildPage } from '@/components/common/build-page'
import { DatasheetCardsList } from '@/components/modules/datasheet/datasheet-cards'
import { File } from 'lucide-react'

export default function ConfiguradorFichasPage() {
  return (
    <BuildPage
      icon={<File />}
      title="Ficha Técnica"
      description={`Bem-vindo! Este é o espaço onde você criar e configurar fichas técnicas`}
      children={<DatasheetCardsList />}
    />
  )
}