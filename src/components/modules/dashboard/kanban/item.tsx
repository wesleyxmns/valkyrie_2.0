import { DraggableProvided, DraggableStyle, DraggingStyle } from "@hello-pangea/dnd";
import { getStyle } from "./get-style";
import { ReactElement, ReactNode } from "react";

interface ItemProps {
  provided: DraggableProvided;
  task: Record<string, any>;
  style:  DraggableStyle | DraggingStyle;
  isDragging: boolean;
  children?: ReactNode | ReactElement;
}

export function Item({ task, children, isDragging, provided, style }: ItemProps) {
  return (
    <div
      // {...provided.draggableProps} //PROPRIEDADE RESPONSÁVEL POR MANTER O ITEM DRAGGABLE.
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={getStyle({
        draggableStyle: provided.draggableProps.style || {},
        virtualStyle: style,
        isDragging,
      })}
      className={`item ${isDragging ? "is-dragging" : ""}`}
    >
      {children}
    </div>
  );
}