'use client'
import { DraggableProvided, DraggableRubric, DraggableStateSnapshot, Droppable, DroppableProvided } from "@hello-pangea/dnd";
import { FixedSizeList } from "react-window";
import { Item } from "./item";
import { Row } from "./row";
import { TaskCard } from "./task-card";

interface ListTasks {
  columnId: string;
  tasks: Record<string, any>[];
}

export function TasksList({ columnId, tasks }: ListTasks) {
  return (
    <Droppable
      isDropDisabled={true}
      droppableId={columnId}
      type="card"
      mode="virtual"
      renderClone={(provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => (
        <Item
          provided={provided}
          task={tasks[rubric.source.index]}
          isDragging={snapshot.isDragging}
          style={provided.draggableProps.style || {}}
        >
          <TaskCard
            tasks={tasks}
            index={rubric.source.index}
            columnid={columnId}
          />
        </Item>
      )}
    >
      {(provided: DroppableProvided) => (
        <FixedSizeList
          key={columnId}
          height={500}
          itemCount={tasks.length}
          itemSize={130}
          width={300}
          className="custom-scrollbar"
          outerRef={provided.innerRef}
          itemData={{ tasks }}
        >
          {Row}
        </FixedSizeList>
      )}
    </Droppable>
  );
}