'use client';
import CardBoardList from "@/components/common/build-card-list";
import { UserDTO } from "@/dtos/responses/user-dto";
import { useAuth } from "@/hooks/auth/use-auth";
import { jiraGroups } from "@/shared/constants/jira/jira-groups";
import ConfImage from '../../../../public/assets/images/png/consult-datasheet-configurator-preview.png';
import ConsultImage from '../../../../public/assets/images/png/consult-datasheet-preview.png';
import FormImage from '../../../../public/assets/images/png/datasheet-form-preview.png';

export function DatasheetCards() {
  const { user } = useAuth()

  const cards = [
    {
      title: 'Configurador',
      description:
        'Crie a estrutura adequada com marcações e aumente sua produtividade.',
      url: 'ficha-tecnica/configurador',
      previewImageURL: ConfImage,
      allowedGroups: [jiraGroups.dti],
    },
    {
      title: 'Formulário',
      description:
        'Crie o formulário preenchendo os campos necessários e referenciando as configurações criadas.',
      url: 'ficha-tecnica/formulario',
      previewImageURL: FormImage,
    },
    {
      title: 'Consultar Fichas',
      description:
        'Busque pela a Ordem de Produção as fichas de definição e liberação criadas anteriormente.',
      url: 'ficha-tecnica/consultar',
      previewImageURL: ConsultImage,
    }
  ]

  return {
    user,
    cards,
  }
}

export function DatasheetCardsList() {
  const { cards, user } = DatasheetCards()
  return (
    <CardBoardList cards={cards} currentUser={user as UserDTO} />
  )
}
