'use client'
import { memo } from "react";
import { Item } from "./item";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { TaskCard } from "./task-card";

export const Row = memo(function Row(props: Record<string, any>) {
  const { data: { tasks }, index, style } = props;
  const item = { ...tasks[index], index };
  const items = tasks.map((task: Record<string, any>) => { return task })
  if (!items[index]) {
    return null;
  }

  return (
    <Draggable draggableId={item.id} index={index} key={item.id}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        return (
          <Item isDragging={snapshot.isDragging} provided={provided} task={items[index]} style={style} >
            <TaskCard tasks={tasks} key={items[index].key} index={index} columnid={item.id} />
          </Item>
        )
      }}
    </Draggable>
  );
});