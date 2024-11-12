'use client'
import { KanbanContext } from "@/contexts/kanban/kanban-context";
import { ColumnKanbanProps } from "@/shared/types/kanban";
import { useCallback, useState } from "react";

export function KabanProvider({ children }) {

  const [columns, setColumns] = useState([] as ColumnKanbanProps[]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const updateColumns = useCallback((updater: (prevColumns: ColumnKanbanProps[]) => ColumnKanbanProps[]) => {
    setColumns(updater);
  }, []);

  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  return (
    <KanbanContext.Provider value={{ columns, isDragging, setColumns, setIsDragging, updateColumns, reorder }}>
      {children}
    </KanbanContext.Provider>
  )
}