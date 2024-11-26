'use client';
import HorizontalScrollWrapper from '@/components/ui/horizontal-scroll-wrapper';
import { UserDTO } from '@/dtos/responses/user-dto';
import { isUserInGroup } from '@/lib/utils/utils';
import { jiraGroups } from '@/shared/constants/jira/jira-groups';
import { ColumnKanbanProps } from '@/shared/types/kanban';
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useMemo } from 'react';
import { Column } from "./column";

interface KanbanProps {
  structure: ColumnKanbanProps[];
  user: UserDTO;
}

export function Kanban({ structure, user }: KanbanProps) {

  const quality = isUserInGroup(user, jiraGroups.quality) || isUserInGroup(user, jiraGroups.quality_manager);
  const director = isUserInGroup(user, jiraGroups.directorship);
  const managerGroup = user && user.getGroups().items?.find(group => group.name.includes('Manager'));

  const filteredStructure = useMemo(() => {
    if (quality) {
      return structure;
    }

    if (director) {
      return structure.filter(column => column.title === 'Aguardando Aprovação');
    }

    if (managerGroup) {
      return structure.filter(column => {
        return column.title === 'Em Análise' ||
          column.title === 'VALIDA' ||
          column.title === 'INVALIDA' ||
          column.title === 'In Progress' ||
          column.title === 'Aguardando Aprovação' ||
          column.title === 'APROVADA' ||
          column.title === 'Under Review'
      });
    }

    return structure.filter(column => {
      return column.title === 'In Progress' || column.title === 'Under Review'
    });
  }, [structure, user]);

  if (filteredStructure.length === 0) {
    return (
      <div className="w-full h-[620px] flex items-center justify-center">
        <p className="text-gray-500">Nenhuma coluna disponível para o seu perfil.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[620px] overflow-x-auto">
      <DragDropContext onDragEnd={() => { }}>
        <Droppable
          droppableId="droppable-list"
          type="list"
          direction="horizontal"
        >
          {(provided) => (
            <HorizontalScrollWrapper className="h-full cursor-grabbing" >
              <div
                className="flex gap-4 h-[500px] w-full"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredStructure.map((item: ColumnKanbanProps, index: number) => {
                  return (
                    <Column
                      key={item.id}
                      id={item.id}
                      title={item.title.toUpperCase()}
                      index={index}
                      tasks={item.tasks}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            </HorizontalScrollWrapper>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}