export type ColumnKanbanProps = {
  id: string;
  title: string;
  tasks: Record<string, any>[];
}

export type KanbanContextProps = {
  columns: ColumnKanbanProps[];
  isDragging: boolean;
  setColumns: (columns: ColumnKanbanProps[]) => void;
  setIsDragging: (isDragging: boolean) => void;
  updateColumns: (updater: (prevColumns: ColumnKanbanProps[]) => ColumnKanbanProps[]) => void;
  reorder: <T>(list: T[], startIndex: number, endIndex: number) => T[];
}