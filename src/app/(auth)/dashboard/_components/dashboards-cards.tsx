'use client'
import CardBoardList from "@/components/common/build-card-list"
import { UserDTO } from "@/dtos/responses/user-dto"
import { useAuth } from "@/hooks/auth/use-auth"
import WFTQIMAGEPREVIEW from '../../../../../public/assets/images/previews/wftq-dashboard-preview.png'

export function DashboardCards() {
  const { user } = useAuth()

  const cards = [
    {
      title: 'WFTQ',
      description: `Esta página foi desenvolvida para gerenciar não conformidades, permitindo 
            o registro, acompanhamento e análise de falhas ou desvios nos produtos e processos. 
            Com esta ferramenta, é possível rastrear e documentar ações corretivas e preventivas 
            de forma centralizada e eficiente.`,
      url: 'dashboard/WFTQ',
      previewImageURL: WFTQIMAGEPREVIEW,
    }
  ]

  return {
    user,
    cards,
  }
}

export function DashboardCardsList() {
  const { cards, user } = DashboardCards()
  return (
    <CardBoardList cards={cards} currentUser={user as UserDTO} />
  )
}
