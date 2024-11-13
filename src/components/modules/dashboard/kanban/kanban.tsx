'use client';
import React, { useMemo } from 'react';
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Column } from "./column";
import { ColumnKanbanProps } from '@/shared/types/kanban';
import { UserDTO } from '@/dtos/responses/user-dto';
import { TaskAccessValidator } from '@/lib/validators/task-acess-validator';
import { extractStatusesFromJQL } from '@/lib/utils/utils';
import HorizontalScrollWrapper from '@/components/ui/horizontal-scroll-wrapper';

interface KanbanProps {
  structure: ColumnKanbanProps[];
  user: UserDTO;
}

export function Kanban({ structure, user }: KanbanProps) {
  const taskAccessValidator = useMemo(() => new TaskAccessValidator(user), [user]);

  const filteredStructure = useMemo(() => {
    const jql = taskAccessValidator.getTaskJQL();
    const allowedStatuses = extractStatusesFromJQL(jql);

    return structure.filter(column => {
      const columnStatus = column.title.toUpperCase().trim();
      const isAllowed = allowedStatuses.some(status =>
        status.trim() === columnStatus ||
        (status.includes(columnStatus) || columnStatus.includes(status))
      );

      return isAllowed;
    });
  }, [structure, taskAccessValidator]);

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