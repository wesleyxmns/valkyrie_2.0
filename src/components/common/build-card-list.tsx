import { UserDTO } from '@/dtos/responses/user-dto';
import React from 'react';
import CardBoard from './card-board';
import { StaticImageData } from 'next/image';

interface CardBoardData {
  title?: string;
  description?: string;
  url?: string;
  previewImageURL?: string | StaticImageData;
  allowedGroups?: string[];
}

interface CardBoardListProps {
  cards: CardBoardData[];
  currentUser: UserDTO;
}

const CardBoardList = ({ cards, currentUser }: CardBoardListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <CardBoard
          key={`${card.title}-${index}`}
          title={card.title ?? ''}
          description={card.description ?? ''}
          url={card.url ?? ''}
          previewImageURL={card.previewImageURL}
          currentUser={currentUser}
          allowedGroups={card.allowedGroups}
        />
      ))}
    </div>
  );
};

export default CardBoardList;