import { ColumnKanbanProps } from "@/shared/types/kanban";

interface SearchCardByIdProps {
  id: string
  columns: ColumnKanbanProps[],
}

export function searchCardById({ id, columns }: SearchCardByIdProps) {
  let task: Record<string, any> | null = null;
  let columnId: string | null = null;

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    for (let j = 0; j < column.tasks.length; j++) {
      const item = column.tasks[j];
      if (item.id === id) {
        task = item;
        columnId = column.id;
        break;
      }
    }
  }

  return { task, columnId };
}