import { DraggableStyle, DraggingStyle } from "@hello-pangea/dnd";

interface GetStyleProps {
  isDragging: boolean;
  draggableStyle: DraggableStyle | DraggingStyle;
  virtualStyle: DraggableStyle | DraggingStyle;
}
export function getStyle({ draggableStyle, virtualStyle, isDragging }: GetStyleProps) {
  const combined = {
    ...virtualStyle,
    ...draggableStyle,
  };

  const grid = 8;

  const result = {
    ...combined,
    height: isDragging ? (combined as { height: number }).height : (combined as { height: number }).height - grid,
    left: isDragging ? (combined as { left: number }).left : (combined as { left: number }).left + grid,
    opacity: isDragging ? 0.8 : 1,
    scale: isDragging ? 1.1 : 1,
    width: isDragging
      ? (draggableStyle as { width: string }).width
      : `calc(${(combined as { width: string }).width} - ${grid * 2}px)`,
    marginBottom: grid,
  };

  return result;
}