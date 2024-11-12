'use client'
import React from 'react';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { UserDTO } from '@/dtos/responses/user-dto';

export interface CardBoardProps {
  title: string;
  description: string;
  content?: React.ReactNode;
  url: string;
  previewImageURL?: string | StaticImageData;
  allowedGroups?: string[] | 'all';
  currentUser?: UserDTO;
}

const hasAccess = (allowedGroups: string[] | 'all' | undefined, userGroups: string[] = []) => {
  if (!allowedGroups) return true;
  if (allowedGroups === 'all') return true;
  return userGroups.some(group => allowedGroups.includes(group));
};

const CardBoard = ({
  description,
  url,
  title,
  previewImageURL,
  allowedGroups,
  currentUser,
}: CardBoardProps) => {
  const router = useRouter();

  if (!hasAccess(allowedGroups, currentUser?.getGroups().items?.map(group => group.name))) {
    return null;
  }

  const handleAccess = () => {
    router.push(url);
  };

  return (
    <CardContainer className="inter-var">
      <CardBody
        onClick={handleAccess}
        className="w-80 h-[25rem] bg-white dark:bg-gray-800 cursor-pointer rounded-xl p-6 border border-gray-200 dark:border-gray-700 transition-colors hover:border-gray-300 dark:hover:border-gray-600"
      >
        <div className="h-full flex flex-col">
          <div className="flex-1">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              {title}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-sm text-neutral-500 dark:text-neutral-300 mt-2"
            >
              {description}
            </CardItem>
          </div>

          {previewImageURL && (
            <CardItem
              translateZ="100"
              className="w-full mt-4 overflow-hidden rounded-xl"
            >
              <div className="relative w-full h-48">
                <Image
                  src={previewImageURL}
                  alt={`Preview of ${title}`}
                  fill
                  className="object-cover rounded-xl group-hover/card:shadow-xl transition-shadow duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </CardItem>
          )}
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default CardBoard;